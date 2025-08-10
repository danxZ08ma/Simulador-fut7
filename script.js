let ligas = JSON.parse(localStorage.getItem('ligas')) || [];

function mostrarLigas() {
  const div = document.getElementById('ligas');
  if (ligas.length === 0) {
    div.innerHTML = '<p>No hay ligas creadas aún.</p>';
    return;
  }
  let html = '<ul>';
  for (const liga of ligas) {
    html += `<li>${liga.nombre}</li>`;
  }
  html += '</ul>';
  div.innerHTML = html;
}

function crearLiga() {
  const nombre = prompt('Nombre de la liga:');
  if (nombre) {
    ligas.push({ nombre: nombre, partidos: [] });
    localStorage.setItem('ligas', JSON.stringify(ligas));
    mostrarLigas();
  }
}

mostrarLigas();
