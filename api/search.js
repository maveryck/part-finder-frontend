export default async function handler(request, response) {
  const supabaseUrl = "https://pofxtrdtjmqqdviewdlg.supabase.co";
  // Usamos la clave de servicio, que tiene más privilegios
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnh0cmR0am1xcWR2aWV3ZGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA1MzQyOSwiZXhwIjoyMDc0NjI5NDI5fQ.GesRx7rzTiZrWYmIf2cr20F7952_nHHOam1q72UE-nA";

  const searchTerm = request.query.term || '';

  if (!searchTerm) {
    return response.status(400).json({ error: 'Falta el término de búsqueda.' });
  }

  // Construimos la URL final para la API REST de Supabase
  const apiUrl = `${supabaseUrl}/rest/v1/servidores?nombre_modelo=ilike.%${encodeURIComponent(searchTerm)}%&select=*`;
  
  console.log(`Intentando fetch a: ${apiUrl}`);

  try {
    // Usamos fetch directamente, como al principio
    const apiResponse = await fetch(apiUrl, {
      headers: {
        // La clave de servicio se pasa como 'apikey', igual que la 'anon'
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    // Verificamos si la respuesta de Supabase es un error
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Error recibido de Supabase:", errorText);
      // Lanzamos el error para que sea capturado por el bloque catch
      throw new Error(errorText);
    }

    const data = await apiResponse.json();
    
    // Devolvemos los datos al frontend
    return response.status(200).json(data);
    
  } catch (error) {
    console.error("Error en la función del servidor (catch):", error.message);
    // Devolvemos el mensaje de error real de Supabase
    return response.status(500).json({ error: error.message });
  }
}
