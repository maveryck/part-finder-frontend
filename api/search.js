export default async function handler(request, response) {
  // --- Claves de Supabase ---
  const supabaseUrl = "https://pofxtrdtjmqqdviewdlg.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnh0cmR0am1xcWR2aWV3ZGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTM0MjksImV4cCI6MjA3NDYyOTQyOX0.SYCQuh9YSBgzvtU2Invo0_tPjTDZHz6Fu162C4uX7Ws";

  // --- Lógica de Búsqueda ---
  const searchTerm = request.query.term || '';
  
  // Construimos la URL base.
  let apiUrl = `${supabaseUrl}/rest/v1/servidores?select=*`;

  // Si se proporciona un término de búsqueda, añadimos el filtro a la URL.
  if (searchTerm) {
    apiUrl += `&nombre_modelo=ilike.%${encodeURIComponent(searchTerm)}%`;
  }
  
  try {
    // Realizamos la llamada a la API de Supabase desde el servidor de Vercel.
    const apiResponse = await fetch(apiUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        // --- CABECERA CLAVE ---
        // Añadimos un User-Agent personalizado para identificarnos
        // y evitar ser bloqueados por sistemas de seguridad como Cloudflare.
        'User-Agent': `PartFinderApp/1.0 (Vercel; +https://part-finder-frontend-....vercel.app)` // Puedes poner tu URL aquí si quieres
      }
    });

    // Verificamos si la respuesta de Supabase fue exitosa.
    if (!apiResponse.ok) {
      // Si no fue exitosa, leemos el mensaje de error y lo lanzamos.
      const errorText = await apiResponse.text();
      console.error("Error recibido desde Supabase:", errorText);
      throw new Error(`Error desde Supabase: ${errorText}`);
    }

    // Si fue exitosa, convertimos la respuesta a JSON.
    const data = await apiResponse.json();
    
    // Devolvemos los datos al frontend con un estado 200 (OK).
    return response.status(200).json(data);
    
  } catch (error) {
    // Si ocurre cualquier error en el proceso, lo registramos en los logs de Vercel.
    console.error("Error en la función del servidor:", error);
    // Devolvemos un error 500 (Internal Server Error) al frontend.
    return response.status(500).json({ error: error.message });
  }
}
