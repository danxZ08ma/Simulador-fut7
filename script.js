let ligas = JSON.parse(localStorage.getItem('ligas')) || [];
let ligaSeleccionada = null;

function mostrarLigas() {
  const div = document.getElementById('ligas');
  if (ligas.length === 0) {
    div.innerHTML = '<p>No hay ligas creadas aún.</p>';
    return;
  }
  let html = '<ul>';
  for (let i = 0; i < ligas.length; i++) {
    html += `<li><a href="#" onclick="verLiga(${i})">${ligas[i].nombre}</a></li>`;
  }
  html += '</ul>';
  div.innerHTML = html;
}

function crearLiga() {
  const nombre = prompt('Nombre de la liga:');
  if (nombre) {
    ligas.push({ nombre: nombre, partidos: [] });
    guardarYMostrar();
  }
}

function verLiga(index) {
  ligaSeleccionada = index;
  const liga = ligas[index];
  const div = document.getElementById('ligas');

  let html = `<h2>Liga: ${liga.nombre}</h2>`;
  html += `<button onclick="agregarPartido()">Agregar Partido</button>`;
  html += `<button onclick="mostrarTabla()">Ver Tabla de Posiciones</button>`;
  html += '<ul>';
  if (liga.partidos.length === 0) {
    html += '<li>No hay partidos aún.</li>';
  } else {
    for (let i = 0; i < liga.partidos.length; i++) {
      const p = liga.partidos[i];
      html += `<li>${p.equipo1} vs ${p.equipo2} - Resultado: ${p.resultado || 'No jugado'} 
      <button onclick="ponerResultado(${i})">Poner resultado</button></li>`;
    }
  }
  html += '</ul>';
  html += `<button onclick="mostrarLigas()">Volver a ligas</button>`;
  html += `<div id="tabla"></div>`;
  div.innerHTML = html;
}

function agregarPartido() {
  const equipo1 = prompt('Nombre equipo 1:');
  const equipo2 = prompt('Nombre equipo 2:');
  if (equipo1 && equipo2) {
    ligas[ligaSeleccionada].partidos.push({ equipo1, equipo2, resultado: null });
    guardarYMostrar();
    verLiga(ligaSeleccionada);
  }
}

function ponerResultado(partidoIndex) {
  const resultado = prompt('Escribe el resultado (ejemplo: 3-1):');
  if (resultado) {
    ligas[ligaSeleccionada].partidos[partidoIndex].resultado = resultado;
    guardarYMostrar();
    verLiga(ligaSeleccionada);
  }
}

function mostrarTabla() {
  const liga = ligas[ligaSeleccionada];
  const tablaDiv = document.getElementById('tabla');

  // Crear objeto para estadísticas
  let equipos = {};

  // Inicializar equipos
  liga.partidos.forEach(p => {
    if (!equipos[p.equipo1]) equipos[p.equipo1] = crearEstadisticas();
    if (!equipos[p.equipo2]) equipos[p.equipo2] = crearEstadisticas();
  });

  // Procesar resultados
  liga.partidos.forEach(p => {
    if (!p.resultado) return; // No jugado aún

    const [goles1, goles2] = p.resultado.split('-').map(x => parseInt(x.trim()));

    if (isNaN(goles1) || isNaN(goles2)) return; // Resultado inválido

    equipos[p.equipo1].pj++;
    equipos[p.equipo2].pj++;

    equipos[p.equipo1].gf += goles1;
    equipos[p.equipo1].gc += goles2;
    equipos[p.equipo2].gf += goles2;
    equipos[p.equipo2].gc += goles1;

    if (goles1 > goles2) {
      equipos[p.equipo1].pg++;
      equipos[p.equipo2].pp++;
      equipos[p.equipo1].pts += 3;
    } else if (goles1 < goles2) {
      equipos[p.equipo2].pg++;
      equipos[p.equipo1].pp++;
      equipos[p.equipo2].pts += 3;
    } else {
      equipos[p.equipo1].pe++;
      equipos[p.equipo2].pe++;
      equipos[p.equipo1].pts += 1;
      equipos[p.equipo2].pts += 1;
    }
  });

  // Convertir a array y ordenar por puntos y diferencia de goles
  let tabla = Object.keys(equipos).map(nombre => {
    let e = equipos[nombre];
    e.nombre = nombre;
    e.dg = e.gf - e.gc; // diferencia goles
    return e;
  });

  tabla.sort((a, b) => b.pts - a.pts || b.dg - a.dg);

  // Construir tabla HTML
  let html = `<h3>Tabla de posiciones</h3>`;
  html += `<table border="1" cellpadding="5" cellspacing="0">
    <tr>
      <th>Equipo</th>
      <th>PJ</th>
      <th>PG</th>
      <th>PE</th>
      <th>PP</th>
      <th>GF</th>
      <th>GC</th>
      <th>DG</th>
      <th>PTS</th>
    </tr>`;

  tabla.forEach(e => {
    html += `<tr>
      <td>${e.nombre}</td>
      <td>${e.pj}</td>
      <td>${e.pg}</td>
      <td>${e.pe}</td>
      <td>${e.pp}</td>
      <td>${e.gf}</td>
      <td>${e.gc}</td>
      <td>${e.dg}</td>
      <td>${e.pts}</td>
    </tr>`;
  });

  html += `</table>`;

  tablaDiv.innerHTML = html;
}

function crearEstadisticas() {
  return {
    pj: 0, // partidos jugados
    pg: 0, // partidos ganados
    pe: 0, // partidos empatados
    pp: 0, // partidos perdidos
    gf: 0, // goles a favor
    gc: 0, // goles en contra
    pts: 0  // puntos
  };
}

function guardarYMostrar() {
  localStorage.setItem('ligas', JSON.stringify(ligas));
  mostrarLigas();
}

// Mostrar ligas al cargar
mostrarLigas();
