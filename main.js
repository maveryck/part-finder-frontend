import '/style.css';

// Referencias a los elementos HTML
const mainTitle = document.querySelector('h1');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsContainer = document.querySelector('#results-container');

// --- NUEVA FUNCIÓN: Obtiene y muestra los componentes para un servidor específico ---
async function getAndDisplayComponents(serverId, containerElement) {
  containerElement.innerHTML = '<p>Cargando componentes...</p>';
  try {
    const response = await fetch(`/api/get-components?serverId=${serverId}`);
    const components = await response.json();

    if (!response.ok) {
      throw new Error(components.error || 'Error al cargar componentes.');
    }

    if (components.length === 0) {
      containerElement.innerHTML = '<p>No se encontraron componentes para este servidor.</p>';
      return;
    }

    // Creamos una tabla para mostrar los componentes de forma ordenada
    const componentsHtml = `
      <table>
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Part Number</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          ${components.map(comp => `
            <tr>
              <td>${comp.categoria || ''}</td>
              <td>${comp.descripcion}</td>
              <td><strong>${comp.part_number || ''}</strong></td>
              <td>${comp.notas || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    containerElement.innerHTML = componentsHtml;

  } catch (error) {
    containerElement.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// --- Función para mostrar los resultados de la BÚSQUEDA DE SERVIDORES ---
function displayResults(servidores) {
  if (!resultsContainer) return;
  if (servidores.length === 0) {
    resultsContainer.innerHTML = '<p>No se encontraron servidores que coincidan.</p>';
    return;
  }
  
  const serverHtml = servidores.map(s => `
    <div class="resultado-item" style="border-bottom: 1px solid #eee; padding: 1rem 0;">
      <h3>${s.nombre_modelo}</h3>
      <p>Marca: ${s.marca} / ID: ${s.id}</p>
      <!-- ¡CAMBIOS IMPORTANTES AQUÍ! -->
      <a href="#" class="view-parts-btn" data-server-id="${s.id}">Ver todos los Part Numbers</a>
      <!-- Contenedor para los componentes de ESTE servidor -->
      <div class="components-container" id="components-for-${s.id}"></div>
    </div>
  `).join('');
  resultsContainer.innerHTML = serverHtml;
}

// --- Función para BUSCAR servidores ---
async function searchServers(searchTerm) {
  mainTitle.textContent = `Resultados para: "${searchTerm}"`;
  resultsContainer.innerHTML = '<p>Buscando...</p>';
  try {
    const apiUrl = `/api/search?term=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error de red');
    displayResults(data);
  } catch (error) {
    mainTitle.textContent = 'Error';
    resultsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// --- Event Listener para el formulario de BÚSQUEDA ---
if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const term = searchInput.value.trim();
    if (term) searchServers(term);
  });
}

// --- NUEVO Event Listener para los clics en "Ver todos los Part Numbers" ---
if (resultsContainer) {
  resultsContainer.addEventListener('click', (event) => {
    // Comprobamos si el elemento clicado es uno de nuestros botones
    const target = event.target;
    if (target.matches('.view-parts-btn')) {
      event.preventDefault(); // Evita que el enlace '#' recargue la página
      const serverId = target.dataset.serverId;
      const componentsContainer = document.querySelector(`#comp
