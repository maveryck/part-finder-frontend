async function searchServers(searchTerm) {
  mainTitle.textContent = `Resultados para: "${searchTerm}"`;
  resultsContainer.innerHTML = '<p>Buscando...</p>';

  try {
    // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
    // La URL ahora apunta a NUESTRA PROPIA API dentro de Vercel.
    // No necesitamos supabaseUrl ni supabaseKey aquí.
    const apiUrl = `/api/search?term=${encodeURIComponent(searchTerm)}`;
    
    // La llamada a fetch ahora no necesita cabeceras de autorización
    const response = await fetch(apiUrl);

    // El resto del código se queda igual...
    if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
    
    const data = await response.json();
    displayResults(data);

  } catch (error) {
    mainTitle.textContent = 'Error';
    resultsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    console.error(error);
  }
}
