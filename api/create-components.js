import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { serverId, components } = request.body;
    if (!serverId || !Array.isArray(components) || components.length === 0) {
      return response.status(400).json({ error: 'Faltan datos o el formato es incorrecto.' });
    }

    // Preparamos los datos para una inserción masiva
    for (const comp of components) {
      await sql`
        INSERT INTO componentes (categoria, descripcion, part_number, notas, servidor_id)
        VALUES (${comp.category}, ${comp.description}, ${comp.part_number}, ${comp.notes}, ${serverId});
      `;
    }
    
    return response.status(201).json({ message: `${components.length} componentes creados exitosamente.` });

  } catch (error) {
    console.error("Error al crear componentes:", error);
    return response.status(500).json({ error: error.message });
  }
}
