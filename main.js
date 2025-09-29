// Este main.js es una versión simplificada para la Fase 2.
// Primero vamos a listar todos los servidores, luego implementaremos la búsqueda.

const resultsContainer = document.querySelector('#results-container');
const mainTitle = document.querySelector('h1');

async function fetchAndDisplayServers() {
  try {
    // Reemplaza estas variables con tus Variables de Entorno de Vercel
    const supabaseUrl = 'TU_SUPABASE_URL'; 
    const supabaseKey = 'TU_SUPABASE_KEY';

    if (!supabaseUrl.startsWith('http') || !supabaseKey) {
      throw new Error("Las claves de Supabase no están configuradas correctamente.");
    }

    const apiUrl = `${supabaseUrl}/rest/v1/servidores?select=*`;
    const response = await fetch(apiUrl, {
      headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
    });

    if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
    
    const servidores = await response.json();
    mainTitle.textContent = 'Servidores Encontrados';

    if (servidores.length === 0) {
      resultsContainer.innerHTML = '<p>No hay servidores en la base de datos.</p>';
      return;
    }

    const serverHtml = servidores.map(s => `<div><h3>${s.marca} ${s.nombre_modelo}</h3></div>`).join('');
    resultsContainer.innerHTML = serverHtml;

  } catch (error) {
    mainTitle.textContent = 'Error';
    resultsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    console.error(error);
  }
}

fetchAndDisplayServers();