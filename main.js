import '/style.css';

// Referencias a los elementos HTML
const mainTitle = document.querySelector('h1');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsContainer = document.querySelector('#results-container');

function displayResults(data) {
  if (!resultsContainer) return;

  // --- ¡LA LÓGICA MEJORADA! ---
  // Primero, comprobamos si la respuesta es un array.
  if (Array.isArray(data)) {
    if (data.length === 0) {
      resultsContainer.innerHTML = '<p>No se encontraron servidores que coincidan.</p>';
      return;
    }
    // Si es un array, lo mapeamos como antes.
    const serverHtml = data.map(s => `
      <div style="border-bottom: 1px solid #eee; padding: 1rem 0;">
        <h3>${s.marca} ${s.nombre_modelo}</h3>
        <p>ID: ${s.id}</p>
      </div>
    `).join('');
    resultsContainer.innerHTML = serverHtml;
  } else if (data && data.error) {
    // Si NO es un array pero tiene una propiedad 'error', mostramos ese error.
    console.error("Error recibido de la API del servidor:", data.error);
    resultsContainer.innerHTML = `<p style="color:red;">Error del servidor: ${data.error}</p>`;
  } else {
    // Para cualquier otro caso inesperado.
    resultsContainer.innerHTML = '<p style="color:red;">Respuesta inesperada del servidor.</p>';
  }
}

async function searchServers(searchTerm) {
  mainTitle.textContent = `Resultados para: "${searchTerm}"`;
  resultsContainer.innerHTML = '<p>Buscando...</p>';

  try {
    const apiUrl = `/api/search?term=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(apiUrl);
    
    // Obtenemos la respuesta como JSON, sin importar si es un éxito o un error.
    const data = await response.json();

    if (!response.ok) {
      // Si la respuesta HTTP no fue 200, lanzamos el mensaje de error del JSON.
      throw new Error(data.error || `Error de red: ${response.statusText}`);
    }
    
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
