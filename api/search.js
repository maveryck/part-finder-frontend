export default async function handler(request, response) {
  const supabaseUrl = "https://pofxtrdtjmqqdviewdlg.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnh0cmR0am1xcWR2aWV3ZGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTM0MjksImV4cCI6MjA3NDYyOTQyOX0.SYCQuh9YSBgzvtU2Invo0_tPjTDZHz6Fu162C4uX7Ws";

  // Usamos decodeURIComponent para manejar espacios y caracteres especiales
  const searchTerm = decodeURIComponent(request.query.term || '');
  
  // Log para depuración en Vercel
  console.log(`Buscando término: "${searchTerm}"`);

  if (!searchTerm) {
    return response.status(400).json({ error: 'Falta el término de búsqueda (term).' });
  }

  // Codificamos el término de búsqueda de nuevo para la URL final de Supabase
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const apiUrl = `${supabaseUrl}/rest/v1/servidores?select=*`;
  
  try {
    const apiResponse = await fetch(apiUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Error desde Supabase:", errorText);
      throw new Error(`Error al contactar la base de datos: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();
    
    return response.status(200).json(data);
    
  } catch (error) {
    console.error("Error en la función del servidor:", error);
    return response.status(500).json({ error: error.message });
  }
}
