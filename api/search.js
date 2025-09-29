export default async function handler(request, response) {
  // --- Leemos las claves de forma segura desde las Variables de Entorno de Vercel ---
  // Nunca expongas tus claves directamente en el código de un repositorio público.
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Usamos la clave de servicio para operaciones de backend.

  // --- Validación de Configuración ---
  // Si las variables no están definidas en Vercel, devolvemos un error claro.
  if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Variables de entorno de Supabase no configuradas en Vercel.");
    return response.status(500).json({ error: 'Configuración del servidor incompleta.' });
  }
  
  // --- Lógica de Búsqueda ---
  const searchTerm = request.query.term || '';

  if (!searchTerm) {
    return response.status(400).json({ error: 'Falta el término de búsqueda (term).' });
  }

  // Construimos la URL de la API REST de Supabase.
  const apiUrl = `${supabaseUrl}/rest/v1/servidores?nombre_modelo=ilike.%${encodeURIComponent(searchTerm)}%&select=*`;
  
  console.log(`Función del servidor ejecutada. Buscando: "${searchTerm}"`);

  try {
    // Usamos fetch para llamar a la API de Supabase desde el servidor de Vercel.
    const apiResponse = await fetch(apiUrl, {
      headers: {
        // La clave de servicio se pasa como 'apikey' para la API REST.
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    // Si la respuesta de Supabase no es exitosa, capturamos y devolvemos el error.
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Error recibido de Supabase:", errorText);
      throw new Error(errorText); // Lanzamos el texto del error para que sea capturado por el bloque catch.
    }

    // Si todo va bien, convertimos la respuesta a JSON.
    const data = await apiResponse.json();
    
    // Devolvemos los datos al frontend.
    return response.status(200).json(data);
    
  } catch (error) {
    // Si algo falla en el proceso, lo registramos en los logs de Vercel.
    console.error("Error en el bloque catch de la función del servidor:", error.message);
    // Devolvemos un error 500 con el mensaje capturado.
    return response.status(500).json({ error: error.message });
  }
}
