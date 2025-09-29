import '/style.css';

// Referencias a los elementos HTML
const mainTitle = document.querySelector('h1');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsContainer = document.querySelector('#results-container');

function displayResults(servidores) {
  if (!resultsContainer) return;
  if (!servidores || servidores.length === 0) {
    resultsContainer.innerHTML = '<p>No se encontraron servidores que coincidan.</p>';
    return;
  }
  const serverHtml = servidores.map(s => `
    <div style="border-bottom: 1px solid #eee; padding: 1rem 0;">
      <h3>${s.marca} ${s.nombre_modelo}</h3>
      <p>ID: ${s.id}</p>
    </div>
  `).join('');
  resultsContainer.innerHTML = serverHtml;
}

async function searchServers(searchTerm) {
  mainTitle.textContent = `Resultados para: "${searchTerm}"`;
  resultsContainer.innerHTML = '<p>Buscando...</p>';

  try {
    const apiUrl = `/api/search?term=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error de red: ${response.statusText}`);
    }
    
    const data = await response.json();
    displayResults(data);

  } catch (error) {
    mainTitle.textContent = 'Error';
    resultsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    console.error(error);
  }
}

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const term = searchInput.value.trim();
    if (term) {
      searchServers(term);
    }
  });
}

mainTitle.textContent = 'Busca un Servidor por Modelo';
