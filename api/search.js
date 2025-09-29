export default async function handler(request, response) {
  // --- CLAVES DE SUPABASE DIRECTAMENTE EN EL CÓDIGO ---
  // Reemplazamos la lectura de variables de entorno con los valores reales.
  const supabaseUrl = "https://pofxtrdtjmqqdviewdlg.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnh0cmR0am1xcWR2aWV3ZGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTM0MjksImV4cCI6MjA3NDYyOTQyOX0.SYCQuh9YSBgzvtU2Invo0_tPjTDZHz6Fu162C4uX7Ws";

  // Obtenemos el término de búsqueda de la URL (ej: /api/search?term=R760)
  const searchTerm = request.query.term;
  
  // Verificamos que el término de búsqueda fue enviado
  if (!searchTerm) {
    return response.status(400).json({ error: 'Falta el término de búsqueda (term).' });
  }

  // Construimos la URL de la API de Supabase para hacer la búsqueda
  const apiUrl = `${supabaseUrl}/rest/v1/servidores?nombre_modelo=ilike.%${searchTerm}%&select=*`;
  
  try {
    // Llamamos a Supabase DESDE EL SERVIDOR de Vercel (aquí no hay problemas de CORS)
    const apiResponse = await fetch(apiUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Si Supabase devuelve un error, lo pasamos al frontend
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Error desde Supabase:", errorText);
      throw new Error(`Error al contactar la base de datos: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();
    
    // Devolvemos los datos encontrados al frontend del navegador en formato JSON
    return response.status(200).json(data);
    
  } catch (error) {
    console.error("Error en la función del servidor:", error);
    // Devolvemos un error genérico al frontend
    return response.status(500).json({ error: error.message });
  }
}
