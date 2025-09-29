import { createClient } from '@supabase/supabase-js';

export default async function handler(request, response) {
  // --- Usamos la URL y la clave de SERVICIO ---
  const supabaseUrl = "https://pofxtrdtjmqqdviewdlg.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInRypeCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnh0cmR0am1xcWR2aWV3ZGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA1MzQyOSwiZXhwIjoyMDc0NjI1NDI5fQ.GesRx7rzTiZrWYmIf2cr20F7952_nHHOam1q72UE-nA";

  // Creamos el cliente de Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Obtenemos el término de búsqueda de la URL
  const searchTerm = request.query.term || '';

  // Verificamos que se ha enviado un término de búsqueda
  if (!searchTerm) {
    return response.status(400).json({ error: 'Falta el término de búsqueda (term).' });
  }

  console.log(`Buscando con la service_role key el término: "${searchTerm}"`);

  try {
    // Realizamos la búsqueda usando la librería de Supabase
    const { data, error } = await supabase
      .from('servidores')
      .select()
      .ilike('nombre_modelo', `%${searchTerm}%`);
    
    // Si la librería devuelve un error, lo registramos y lo lanzamos
    if (error) {
      console.error("Error desde la librería de Supabase:", error);
      throw new Error(error.message);
    }

    // Si la búsqueda es exitosa, devolvemos los datos
    return response.status(200).json(data);

  } catch (error) {
    // Si ocurre cualquier otro error, lo registramos y devolvemos un error 500
    console.error("Error en la función del servidor:", error);
    return response.status(500).json({ error: error.message });
  }
}
