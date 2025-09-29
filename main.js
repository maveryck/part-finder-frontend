const supabaseUrl = 'https://pofxtrdtjmqqdviewdlg.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnh0cmR0am1xcWR2aWV3ZGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTM0MjksImV4cCI6MjA3NDYyOTQyOX0.SYCQuh9YSBgzvtU2Invo0_tPjTDZHz6Fu162C4uX7Ws';

// --- Referencias a los elementos HTML ---
const mainTitle = document.querySelector('h1');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsContainer = document.querySelector('#results-container');

// --- Función para MOSTRAR los resultados ---
function displayResults(servidores) {
  if (!resultsContainer) return;
  
  if (!servidores || servidores.length === 0) {
    resultsContainer.innerHTML = '<p>No se encontraron servidores que coincidan.</p>';
    return;
  }
  
  // Arreglamos el error de tipeo. Ahora muestra la marca y el modelo correctamente.
  const serverHtml = servidores.map(s => `
    <div style="border-bottom: 1px solid #eee; padding: 1rem 0;">
      <h3>${s.marca} ${s.nombre_modelo}</h3>
      <p>ID: ${s.id}</p>
    </div>
  `).join('');
  
  resultsContainer.innerHTML = serverHtml;
}

// --- Función para BUSCAR servidores ---
async function searchServers(searchTerm) {
  mainTitle.textContent = `Resultados para: "${searchTerm}"`;
  resultsContainer.innerHTML = '<p>Buscando...</p>';

  try {
    // Construimos la URL con el filtro de búsqueda `ilike`
    const apiUrl = `${supabaseUrl}/rest/v1/servidores?nombre_modelo=ilike.%${searchTerm}%&select=*`;
    
    const response = await fetch(apiUrl, {
      headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
    });

    if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
    
    const data = await response.json();
    displayResults(data);

  } catch (error) {
    mainTitle.textContent = 'Error';
    resultsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    console.error(error);
  }
}

// --- EVENT LISTENER para el formulario ---
// Ahora la magia ocurre cuando envías el formulario
if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Previene que la página se recargue
    
    const term = searchInput.value.trim();
    if (term) {
      searchServers(term);
    }
  });
}

// --- Estado inicial de la página ---
mainTitle.textContent = 'Busca un Servidor por Modelo';