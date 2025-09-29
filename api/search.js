export default async function handler(request, response) {
  // Obtiene el término de búsqueda de la URL (ej: /api/search?term=R760)
  const { searchTerm } = request.query;
  
  // Obtiene las claves de Supabase de las Variables de Entorno de Vercel
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_KEY;

  if (!searchTerm || !supabaseUrl || !supabaseKey) {
    return response.status(400).json({ error: 'Faltan parámetros de búsqueda o configuración de API.' });
  }

  // Construye la URL de la API de Supabase para buscar
  const apiUrl = `${supabaseUrl}/rest/v1/servidores?nombre_modelo=ilike.%${searchTerm}%&select=*`;
  
  try {
    // Llama a Supabase DESDE EL SERVIDOR de Vercel (aquí no hay CORS)
    const apiResponse = await fetch(apiUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!apiResponse.ok) {
      throw new Error(`Error al contactar Supabase: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();
    
    // Devuelve los datos al frontend del navegador
    return response.status(200).json(data);
    
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
