import '/style.css'; // O la ruta correcta a tu archivo CSS principal

// --- Referencias a los elementos del DOM (la página HTML) ---
const mainTitle = document.querySelector('h1');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsContainer = document.querySelector('#results-container');

/**
 * Muestra los resultados de la búsqueda o un mensaje de error en la página.
 * @param {Array|Object} data - Los datos recibidos de la API. Puede ser un array de servidores o un objeto de error.
 */
function displayResults(data) {
  if (!resultsContainer) return;

  // Comprobamos si la respuesta es un array (éxito)
  if (Array.isArray(data)) {
    if (data.length === 0) {
      resultsContainer.innerHTML = '<p>No se encontraron servidores que coincidan con tu búsqueda.</p>';
      return;
    }
    
    // Si es un array con resultados, generamos el HTML
    // ¡AQUÍ ESTÁ LA CORRECCIÓN! Usamos solo 'nombre_modelo' para el título.
    const serverHtml = data.map(servidor => `
      <div class="resultado-item" style="border-bottom: 1px solid #eee; padding: 1rem 0;">
        <h3>${servidor.nombre_modelo}</h3>
        <p>Marca: ${servidor.marca}</p>
        <p>ID: ${servidor.id}</p>
        <a href="#">Ver todos los Part Numbers</a>
      </div>
    `).join('');
    
    resultsContainer.innerHTML = serverHtml;

  } else if (data && data.error) {
    // Si la respuesta es un objeto con una propiedad 'error'
    console.error("Error recibido de la API del servidor:", data.error);
    resultsContainer.innerHTML = `<p style="color:red;">Error del servidor: ${data.error}</p>`;
  } else {
    // Para cualquier otro caso inesperado
    resultsContainer.innerHTML = '<p style="color:red;">Respuesta inesperada del servidor.</p>';
  }
}

/**
 * Realiza una llamada a nuestra API de backend para buscar servidores.
 * @param {string} searchTerm - El texto a buscar.
 */
async function searchServers(searchTerm) {
  mainTitle.textContent = `Resultados para: "${searchTerm}"`;
  resultsContainer.innerHTML = '<p>Buscando...</p>';

  try {
    // Llamamos a nuestra propia API en Vercel, pasando el término de búsqueda
    const apiUrl = `/api/search?term=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(apiUrl);
    
    // Obtenemos la respuesta en formato JSON
    const data = await response.json();

    // Si la respuesta HTTP no fue exitosa (ej: error 500), lanzamos un error
    if (!response.ok) {
      // Usamos el mensaje de error que viene en el JSON de la API
      throw new Error(data.error || `Error de red: ${response.statusText}`);
    }
    
    // Si todo fue bien, llamamos a la función para mostrar los datos
    displayResults(data);

  } catch (error) {
    mainTitle.textContent = 'Error';
    resultsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    console.error(error);
  }
}

// --- Lógica Principal ---
// Nos aseguramos de que el formulario exista antes de añadirle el "escuchador" de eventos.
if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (event) => {
    // Prevenimos que la página se recargue al hacer clic en "Buscar"
    event.preventDefault(); 
    
    const term = searchInput.value.trim(); // Obtenemos el texto y quitamos espacios extra
    if (term) {
      searchServers(term);
    }
  });
}

// Establecemos el título inicial de la página
mainTitle.textContent = 'Busca un Servidor por Modelo';
