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
  html += '<ul>';
  if (liga.partidos.length === 0) {
    html += '<li>No hay partidos aún.</li>';
  } else {
    for (let i = 0; i < liga.partidos.length; i++) {
      const p = liga.partidos[i];
      // Cambiamos para que puedas hacer clic y poner resultado
      html += `<li>${p.equipo1} vs ${p.equipo2} - Resultado: ${p.resultado || 'No jugado'} 
      <button onclick="ponerResultado(${i})">Poner resultado</button></li>`;
    }
  }
  html += '</ul>';
  html += `<button onclick="mostrarLigas()">Volver a ligas</button>`;
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

function guardarYMostrar() {
  localStorage.setItem('ligas', JSON.stringify(ligas));
  mostrarLigas();
}

// Mostrar ligas al cargar
mostrarLigas();
