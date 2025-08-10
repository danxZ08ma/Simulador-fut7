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
  html += '</ul><button onclick="crearLiga()">Crear Nueva Liga</button>';
  div.innerHTML = html;
}

function crearLiga() {
  const nombre = prompt('Nombre de la liga:');
  if (nombre) {
    ligas.push({ nombre, equipos: [], partidos: [] });
    guardarYMostrar();
  }
}

function verLiga(index) {
  ligaSeleccionada = index;
  const liga = ligas[index];
  const div = document.getElementById('ligas');

  let html = `<h2>Liga: ${liga.nombre}</h2>
    <button onclick="eliminarLiga()">Eliminar Liga</button>
    <button onclick="crearEquipo()">Agregar Equipo</button>
    <button onclick="mostrarTabla()">Ver Tabla de Posiciones</button>
    <button onclick="mostrarEstadisticasJugadores()">Ver Estadísticas Jugadores</button>
    <button onclick="mostrarPartidos()">Ver Partidos</button>
    <button onclick="mostrarLigas()">Volver a ligas</button>`;

  div.innerHTML = html;
}

// -------- Equipos --------

function crearEquipo() {
  const liga = ligas[ligaSeleccionada];
  const nombre = prompt('Nombre del equipo:');
  if (nombre) {
    liga.equipos.push({ nombre, jugadores: [] });
    guardarYMostrar();
    verLiga(ligaSeleccionada);
  }
}

function mostrarEquipos() {
  const liga = ligas[ligaSeleccionada];
  let html = '<h3>Equipos</h3><ul>';
  liga.equipos.forEach((eq, i) => {
    html += `<li>${eq.nombre} <button onclick="verEquipo(${i})">Ver Equipo</button> <button onclick="eliminarEquipo(${i})">Eliminar Equipo</button></li>`;
  });
  html += '</ul><button onclick="verLiga(ligaSeleccionada)">Volver a Liga</button>';
  document.getElementById('ligas').innerHTML = html;
}

function eliminarEquipo(index) {
  if (confirm('¿Eliminar equipo? Se eliminarán también sus partidos relacionados.')) {
    const liga = ligas[ligaSeleccionada];
    const nombreEquipo = liga.equipos[index].nombre;
    // eliminar partidos donde participe equipo
    liga.partidos = liga.partidos.filter(p => p.equipo1 !== nombreEquipo && p.equipo2 !== nombreEquipo);
    liga.equipos.splice(index,1);
    guardarYMostrar();
    mostrarEquipos();
  }
}

function verEquipo(index) {
  const liga = ligas[ligaSeleccionada];
  const equipo = liga.equipos[index];
  let html = `<h3>Equipo: ${equipo.nombre}</h3>
    <button onclick="agregarJugador(${index})">Agregar Jugador</button>
    <button onclick="mostrarEquipos()">Volver a Equipos</button>
    <ul>`;

  if (equipo.jugadores.length === 0) html += '<li>No hay jugadores</li>';
  else {
    equipo.jugadores.forEach((j, i) => {
      html += `<li>${j.nombre} (${j.posicion}, ${j.nacionalidad}) - Goles: ${j.goles}, Asistencias: ${j.asistencias}
      <button onclick="eliminarJugador(${index}, ${i})">Eliminar</button></li>`;
    });
  }

  html += '</ul>';
  document.getElementById('ligas').innerHTML = html;
}

function agregarJugador(equipoIndex) {
  const nombre = prompt('Nombre jugador:');
  const posicion = prompt('Posición (ej. Delantero, Defensa):');
  const nacionalidad = prompt('Nacionalidad:');
  if (nombre && posicion && nacionalidad) {
    const liga = ligas[ligaSeleccionada];
    const equipo = liga.equipos[equipoIndex];
    equipo.jugadores.push({ nombre, posicion, nacionalidad, goles: 0, asistencias: 0 });
    guardarYMostrar();
    verEquipo(equipoIndex);
  }
}

function eliminarJugador(equipoIndex, jugadorIndex) {
  if (confirm('Eliminar jugador?')) {
    const liga = ligas[ligaSeleccionada];
    liga.equipos[equipoIndex].jugadores.splice(jugadorIndex,1);
    guardarYMostrar();
    verEquipo(equipoIndex);
  }
}

// -------- Partidos --------

function mostrarPartidos() {
  const liga = ligas[ligaSeleccionada];
  let html = `<h3>Partidos</h3>
    <button onclick="agregarPartido()">Agregar Partido</button>
    <button onclick="verLiga(ligaSeleccionada)">Volver a Liga</button>
    <ul>`;
  if (liga.partidos.length === 0) html += '<li>No hay partidos</li>';
  else {
    liga.partidos.forEach((p,i) => {
      html += `<li>${p.equipo1} vs ${p.equipo2} - Resultado: ${p.resultado || 'No jugado'}
      <button onclick="ponerResultado(${i})">Poner Resultado</button>
      <button onclick="eliminarPartido(${i})">Eliminar Partido</button>
      </li>`;
    });
  }
  html += '</ul>';
  document.getElementById('ligas').innerHTML = html;
}

function agregarPartido() {
  const liga = ligas[ligaSeleccionada];
  if (liga.equipos.length < 2) {
    alert('Debe haber al menos 2 equipos para agregar partidos');
    return;
  }
  let equipo1 = prompt(`Equipo 1:\n${liga.equipos.map((e,i)=>`${i+1}: ${e.nombre}`).join('\n')}`);
  let equipo2 = prompt(`Equipo 2:\n${liga.equipos.map((e,i)=>`${i+1}: ${e.nombre}`).join('\n')}`);

  equipo1 = parseInt(equipo1);
  equipo2 = parseInt(equipo2);

  if (isNaN(equipo1) || isNaN(equipo2) || equipo1 < 1 || equipo2 < 1 || equipo1 > liga.equipos.length || equipo2 > liga.equipos.length) {
    alert('Equipos inválidos');
    return;
  }
  if (equipo1 === equipo2) {
    alert('Debe escoger dos equipos diferentes');
    return;
  }

  liga.partidos.push({
    equipo1: liga.equipos[equipo1-1].nombre,
    equipo2: liga.equipos[equipo2-1].nombre,
    resultado: null,
    goles: [] // Aquí guardaremos goles y asistencias por partido
  });
  guardarYMostrar();
  mostrarPartidos();
}

function ponerResultado(index) {
  const liga = ligas[ligaSeleccionada];
  const partido = liga.partidos[index];
  const resultado = prompt('Escribe el resultado (ejemplo: 3-1):');
  if (!resultado) return;

  const [goles1, goles2] = resultado.split('-').map(x => parseInt(x.trim()));
  if (isNaN(goles1) || isNaN(goles2)) {
    alert('Formato inválido');
    return;
  }

  // Para asignar goles y asistencias, hacemos formulario básico con prompt

  let goles = [];

  // Para cada gol del equipo 1
  for (let i = 0; i < goles1; i++) {
    let jugadorGol = prompt(`Gol ${i+1} del ${partido.equipo1} - Nombre jugador que anotó:`);
    let asistente = prompt(`¿Asistencia? (nombre jugador, o dejar vacío si no hubo):`);
    if (jugadorGol) {
      goles.push({ jugador: jugadorGol, equipo: partido.equipo1, asistente: asistente || null });
    }
  }

  // Para cada gol del equipo 2
  for (let i = 0; i < goles2; i++) {
    let jugadorGol = prompt(`Gol ${i+1} del ${partido.equipo2} - Nombre jugador que anotó:`);
    let asistente = prompt(`¿Asistencia? (nombre jugador, o dejar vacío si no hubo):`);
    if (jugadorGol) {
      goles.push({ jugador: jugadorGol, equipo: partido.equipo2, asistente: asistente || null });
    }
  }

  partido.resultado = resultado;
  partido.goles = goles;

  // Actualizar estadísticas globales
  actualizarEstadisticas(liga);

  guardarYMostrar();
  mostrarPartidos();
}

function actualizarEstadisticas(liga) {
  // Primero resetear todos los goles y asistencias a 0
  liga.equipos.forEach(equipo => {
    equipo.jugadores.forEach(j => {
      j.goles = 0;
      j.asistencias = 0;
    });
  });

  // Recorrer todos los partidos y sus goles para sumar
  liga.partidos.forEach(partido => {
    if (!partido.goles) return;
    partido.goles.forEach(gol => {
      // Buscar jugador en el equipo
      const equipo = liga.equipos.find(e => e.nombre === gol.equipo);
      if (!equipo) return;

      const jugador = equipo.jugadores.find(j => j.nombre.toLowerCase() === gol.jugador.toLowerCase());
      if (jugador) jugador.goles++;

      if (gol.asistente) {
        // Asistente puede ser de cualquier equipo? Normalmente del mismo
        // Buscamos en todos equipos:
        liga.equipos.forEach(eq => {
          const asist = eq.jugadores.find(j => j.nombre.toLowerCase() === gol.asistente.toLowerCase());
          if (asist) asist.asistencias++;
        });
      }
    });
  });
}

function eliminarPartido(index) {
  if (confirm('¿Eliminar partido?')) {
    ligas[ligaSeleccionada].partidos.splice(index, 1);
    // Luego actualizar estadísticas porque puede cambiar todo
    actualizarEstadisticas(ligas[ligaSeleccionada]);
    guardarYMostrar();
    mostrarPartidos();
  }
}

// -------- Tabla de posiciones (igual que antes) --------

function mostrarTabla() {
  const liga = ligas[ligaSeleccionada];
  const tablaDiv = document.getElementById('tabla') || document.createElement('div');
  tablaDiv.id = 'tabla';
  document.getElementById('ligas').appendChild(tablaDiv);

  let equipos = {};

  liga.partidos.forEach(p => {
    if (!equipos[p.equipo1]) equipos[p.equipo1] = crearEstadisticas();
    if (!equipos[p.equipo2]) equipos[p.equipo2] = crearEstadisticas();
  });

  liga.partidos.forEach(p => {
    if (!p.resultado) return;

    const [goles1, goles2] = p.resultado.split('-').map(x => parseInt(x.trim()));

    if (isNaN(goles1) || isNaN(goles2)) return;

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

  let tabla = Object.keys(equipos).map(nombre => {
    let e = equipos[nombre];
    e.nombre = nombre;
    e.dg = e.gf - e.gc;
    return e;
  });

  tabla.sort((a, b) => b.pts - a.pts || b.dg - a.dg);

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

// -------- Estadísticas Jugadores --------

function mostrarEstadisticasJugadores() {
  const liga = ligas[ligaSeleccionada];
  let html = `<h3>Estadísticas de Jugadores en ${liga.nombre}</h3>
    <button onclick="verLiga(ligaSeleccionada)">Volver a Liga</button>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>Jugador</th>
        <th>Equipo</th>
        <th>Goles</th>
        <th>Asistencias</th>
      </tr>`;

  liga.equipos.forEach(equipo => {
    equipo.jugadores.forEach(j => {
      html += `<tr>
        <td>${j.nombre}</td>
        <td>${equipo.nombre}</td>
        <td>${j.goles}</td>
        <td>${j.asistencias}</td>
      </tr>`;
    });
  });

  html += `</table>`;

  document.getElementById('ligas').innerHTML = html;
}

function crearEstadisticas() {
  return {
    pj: 0,
    pg: 0,
    pe: 0,
    pp: 0,
    gf: 0,
    gc: 0,
    pts: 0
  };
}

function eliminarLiga() {
  if (confirm('¿Seguro quieres eliminar esta liga?')) {
    ligas.splice(ligaSeleccionada, 1);
    guardarYMostrar();
    mostrarLigas();
  }
}

function guardarYMostrar() {
  localStorage.setItem('ligas', JSON.stringify(ligas));
  mostrarLigas();
}

// Al cargar mostrar ligas
mostrarLigas();
