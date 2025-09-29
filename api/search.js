import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  console.log("Iniciando función de prueba de conexión...");

  try {
    // La consulta más simple posible: pide la hora actual al servidor de la base de datos.
    // No toca ninguna de nuestras tablas.
    const { rows } = await sql`SELECT NOW();`;
    
    // Si llegamos aquí, la conexión FUE EXITOSA.
    console.log("¡Conexión exitosa! Respuesta de la base de datos:", rows);
    
    return response.status(200).json({ 
      message: "Conexión a la base de datos exitosa.",
      databaseTime: rows[0].now 
    });

  } catch (error) {
    // Si esto falla, el problema es 100% la conexión.
    console.error("FALLO DE CONEXIÓN:", error);
    return response.status(500).json({ 
      error: "No se pudo establecer la conexión con la base de datos.",
      details: error.message 
    });
  }
}
