import dbConnect from '../dbConnect';
import { SystemRequirement, ISystemRequirement } from '@/libs/models/systemRequirement';

/**
 * Obtener todos los requisitos de un usuario
 * @param userId ID del usuario
 * @returns Array de requisitos
 */
export async function getRequirementsByUserId(userId: string): Promise<ISystemRequirement[]> {
  console.log(`Buscando requisitos para el usuario con ID: ${userId}`);
  
  await dbConnect();
  
  try {
    console.log(`Ejecutando consulta: SystemRequirement.find({ userId: "${userId}" })`);

    //const todos = await SystemRequirement.find({}).lean();
    //console.log(`Todos los requisitos encontrados: ${todos.length}`);
    
    const requirements = await SystemRequirement.find({ userId })
      .sort({ updated: -1 })
      .lean();
    
    console.log(`Requisitos encontrados: ${requirements.length}`);
    
    if (requirements.length === 0) {
      console.log('No se encontraron requisitos para este usuario');
    } /* else {
      console.log('Primer requisito encontrado:', JSON.stringify(requirements[0], null, 2));
    } */
    
    // Convertimos los documentos a objetos planos
    const plainRequirements = requirements.map(req => {
      const plainReq = JSON.parse(JSON.stringify(req));
      // Convertir _id a string para asegurar compatibilidad
      plainReq._id = plainReq._id.toString();
      return plainReq;
    });
    
    return plainRequirements as ISystemRequirement[];
  } catch (error) {
    console.error('Error al obtener requisitos:', error);
    throw error;
  }
}

/**
 * Obtener un requisito por su ID
 * @param id ID del requisito
 * @param userId ID del usuario (para verificar pertenencia)
 * @returns El requisito si existe y pertenece al usuario, null en caso contrario
 */
export async function getRequirementById(id: string, userId: string): Promise<ISystemRequirement | null> {
  await dbConnect();
  
  try {
    const requirement = await SystemRequirement.findOne({
      _id: id,
      userId
    }).lean();
    
    // Devolvemos null si no se encuentra el requisito
    if (!requirement) return null;
    
    // Convertimos el documento de Mongoose a un objeto plano
    const plainRequirement = JSON.parse(JSON.stringify(requirement));
    // Convertir _id a string para asegurar compatibilidad
    plainRequirement._id = plainRequirement._id.toString();
    
    return plainRequirement as ISystemRequirement;
  } catch (error) {
    console.error('Error al obtener requisito por ID:', error);
    throw error;
  }
}
