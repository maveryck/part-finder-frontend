import { createClient } from '@supabase/supabase-js';

export default async function handler(request, response) {
  // Usamos las claves de Supabase directamente en el código
  const supabaseUrl = "https://pofxtrdtjmqqdviewdlg.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZnh0cmR0am1xcWR2aWV3ZGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTM0MjksImV4cCI6MjA3NDYyOTQyOX0.SYCQuh9YSBgzvtU2Invo0_tPjTDZHz6Fu162C4uX7Ws";

  // Creamos un cliente de Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

  const searchTerm = request.query.term || '';

  if (!searchTerm) {
    return response.status(400).json({ error: 'Falta el término de búsqueda (term).' });
  }

  console.log(`Buscando con la librería de Supabase el término: "${searchTerm}"`);

  try {
    // --- LA NUEVA FORMA DE BUSCAR ---
    // Usamos la sintaxis de la librería, que es mucho más limpia.
    const { data, error } = await supabase
      .from('servidores')
      .select()
      .ilike('nombre_modelo', `%${searchTerm}%`);
    
    // Si la librería nos devuelve un error, lo manejamos.
    if (error) {
      console.error("Error desde la librería de Supabase:", error);
      throw new Error(error.message);
    }

    // Devolvemos los datos encontrados.
    return response.status(200).json(data);

  } catch (error) {
    console.error("Error en la función del servidor:", error);
    return response.status(500).json({ error: error.message });
  }
}
