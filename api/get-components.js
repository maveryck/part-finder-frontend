import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Obtenemos el ID del servidor de la URL (ej: /api/get-components?serverId=1)
  const serverId = request.query.serverId;

  if (!serverId) {
    return response.status(400).json({ error: 'Falta el ID del servidor (serverId).' });
  }

  try {
    // Hacemos una consulta a la tabla 'componentes' filtrando por 'servidor_id'
    const { rows } = await sql`
      SELECT * FROM componentes 
      WHERE servidor_id = ${serverId};
    `;
    
    return response.status(200).json(rows);

  } catch (error) {
    console.error("Error al buscar componentes:", error);
    return response.status(500).json({ error: error.message });
  }
}
