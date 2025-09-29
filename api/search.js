import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  const searchTerm = request.query.term || '';

  if (!searchTerm) {
    return response.status(400).json({ error: 'Falta el término de búsqueda.' });
  }

  try {
    const { rows } = await sql`
      SELECT * FROM servidores 
      WHERE nombre_modelo ILIKE ${'%' + searchTerm + '%'};
    `;
    
    return response.status(200).json(rows);

  } catch (error) {
    console.error("Error al ejecutar la consulta SQL:", error);
    return response.status(500).json({ error: error.message });
  }
}
