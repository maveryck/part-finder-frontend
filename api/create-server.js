import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Solo permitimos peticiones POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { brand, model } = request.body;
    if (!brand || !model) {
      return response.status(400).json({ error: 'Faltan la marca o el modelo.' });
    }
    
    const { rows } = await sql`
      INSERT INTO servidores (marca, nombre_modelo)
      VALUES (${brand}, ${model})
      RETURNING id;
    `;
    
    // Devolvemos el registro completo del nuevo servidor, incluyendo su ID
    return response.status(201).json(rows[0]);

  } catch (error) {
    console.error("Error al crear el servidor:", error);
    return response.status(500).json({ error: error.message });
  }
}
