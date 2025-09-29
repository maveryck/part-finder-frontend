import '/style.css';

// Referencias a los elementos HTML
const mainTitle = document.querySelector('h1');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsContainer = document.querySelector('#results-container');

// --- Función para mostrar los componentes ---
async function getAndDisplayComponents(serverId, containerElement) {
  containerElement.innerHTML = '<p class="text-center text-slate-500 py-4">Cargando componentes...</p>';
  try {
    const response = await fetch(`/api/get-components?serverId=${serverId}`);
    const components = await response.json();
    if (!response.ok) throw new Error(components.error || 'Error al cargar componentes.');

    if (components.length === 0) {
      containerElement.innerHTML = '<p class="text-center text-slate-600 bg-slate-100 p-4 rounded-lg">No se encontraron componentes para este servidor.</p>';
      return;
    }

    const componentsHtml = `
      <div class="overflow-x-auto mt-4 bg-white rounded-lg shadow">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b bg-slate-100">
            <tr>
              <th class="px-6 py-3 font-medium text-slate-700">Categoría</th>
              <th class="px-6 py-3 font-medium text-slate-700">Descripción</th>
              <th class="px-6 py-3 font-medium text-slate-700">Part Number</th>
              <th class="px-6 py-3 font-medium text-slate-700">Notas</th>
            </tr>
          </thead>
          <tbody>
            ${components.map(comp => `
              <tr class="border-b hover:bg-slate-50">
                <td class="px-6 py-4 text-slate-600">${comp.categoria || ''}</td>
                <td class="px-6 py-4 text-slate-800">${comp.descripcion}</td>
                <td class="px-6 py-4 font-mono font-semibold text-blue-700">${comp.part_number || ''}</td>
                <td class="px-6 py-4 text-slate-600">${comp.notas || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    containerElement.innerHTML = componentsHtml;

  } catch (error) {
    containerElement.innerHTML = `<p class="text-red-500">${error.message}</p>`;
  }
}

// --- Función para mostrar los resultados de la búsqueda ---
function displayResults(servidores) {
  if (!resultsContainer) return;
  if (servidores.length === 0) {
    resultsContainer.innerHTML = '<p class="text-center text-xl text-slate-600 mt-8">No se encontraron servidores que coincidan.</p>';
    return;
  }
  
  const serverHtml = servidores.map(s => `
    <div class="resultado-item bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-slate-800">${s.nombre_modelo}</h2>
      <p class="text-slate-500 mb-4">Marca: ${s.marca} / ID: ${s.id}</p>
      <a href="#" class="view-parts-btn text-blue-600 hover:underline" data-server-id="${s.id}">Ver Part Numbers</a>
      <div class="components-container mt-4" id="components-for-${s.id}"></div>
    </div>
  `).join('');
  resultsContainer.innerHTML = serverHtml;
}

// --- Función para buscar servidores ---
async function searchServers(searchTerm) {
  if (!resultsContainer) return;
  resultsContainer.innerHTML = '<p class="text-center text-xl text-slate-500 mt-8">Buscando...</p>';
  try {
    const apiUrl = `/api/search?term=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error de red');
    displayResults(data);
  } catch (error) {
    resultsContainer.innerHTML = `<p class="text-center text-red-500 mt-8">${error.message}</p>`;
  }
}

// --- Event Listeners ---
if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const term = searchInput.value.trim();
    if (term) searchServers(term);
  });
}

if (resultsContainer) {
  resultsContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('.view-parts-btn')) {
      event.preventDefault();
      const serverId = target.dataset.serverId;
      const componentsContainer = document.querySelector(`#components-for-${serverId}`);
      // Evita recargar si ya hay contenido
      if (serverId && componentsContainer && !componentsContainer.innerHTML) {
        getAndDisplayComponents(serverId, componentsContainer);
      }
    }
  });
}
