export default async function handler(request, response) {
  const supabaseUrl = "https://pofxtrdtjmqqdviewdlg.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnh0cmR0am1xcWR2aWV3ZGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTM0MjksImV4cCI6MjA3NDYyOTQyOX0.SYCQuh9YSBgzvtU2Invo0_tPjTDZHz6Fu162C4uX7Ws";

  const searchTerm = request.query.term || '';
  
  // Construimos la URL base sin el filtro
  let apiUrl = `${supabaseUrl}/rest/v1/servidores?select=*`;

  // Si hay un término de búsqueda, añadimos el filtro 'ilike' de forma segura
  if (searchTerm) {
    apiUrl += `&nombre_modelo=ilike.%${encodeURIComponent(searchTerm)}%`;
  }
  
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
      throw new Error(`Error desde Supabase: ${errorText}`);
    }

    const data = await apiResponse.json();
    return response.status(200).json(data);
    
  } catch (error) {
    console.error("Error en la función del servidor:", error);
    return response.status(500).json({ error: error.message });
  }
}
