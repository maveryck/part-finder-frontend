export default async function handler(request, response) {
  // --- Claves de Supabase directamente en el código para la prueba ---
  const supabaseUrl = "https://pofxtrdtjmqqdviewdlg.supabase.co";
  // Usamos la clave de servicio para tener máximos privilegios desde el backend
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnh0cmR0am1xcWR2aWV3ZGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA1MzQyOSwiZXhwIjoyMDc0NjI5NDI5fQ.GesRx7rzTiZrWYmIf2cr20F7952_nHHOam1q72UE-nA";

  // --- Lógica de Búsqueda ---
  const searchTerm = request.query.term || '';

  if (!searchTerm) {
    return response.status(400).json({ error: 'Falta el término de búsqueda (term).' });
  }

  // Construimos la URL de la API REST de Supabase.
  const apiUrl = `${supabaseUrl}/rest/v1/servidores?nombre_modelo=ilike.%${encodeURIComponent(searchTerm)}%&select=*`;
  
  console.log(`Intentando fetch a: ${apiUrl}`);

  try {
    // Usamos fetch para llamar a la API de Supabase desde el servidor de Vercel.
    const apiResponse = await fetch(apiUrl, {
      headers: {
        // La clave de servicio se pasa como 'apikey' para la API REST.
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    // Si la respuesta de Supabase no es exitosa, capturamos el texto del error.
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
    // Devolvemos el mensaje de error capturado.
    return response.status(500).json({ error: error.message });
  }
}
