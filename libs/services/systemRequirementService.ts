import { ISystemRequirement } from "../models/systemRequirement";
import { FormData } from "@/app/dashboard/create/components/types";
import { 
  createSystemRequirement, 
  getSystemRequirementById, 
  updateSystemRequirementById,
  getSystemRequirementsByUserId,
  deleteSystemRequirementById
} from "@/app/api/utils/systemRequirement";
//import connectDB from "../mongoose";

// Definir tipo para datos planos
interface PlainFormData {
  userId?: string;
  name: string;
  description: string;
  applicationType: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: {
    scalability?: string;
    availability?: string;
    security?: string;
    performance?: string;
  };
  techPreferences: {
    backendLanguage?: string;
    frameworks?: string[];
    databases?: string[];
    architecture?: string;
  };
  additionalContext?: string;
  status?: "draft" | "completed" | "generating" | "failed";
}

// Servicio para manejar las operaciones con los requisitos del sistema
export const SystemRequirementService = {
  /**
   * Crea un nuevo requisito de sistema
   * @param userId ID del usuario
   * @param formData Datos del formulario
   * @returns El requisito creado
   */
  async create(userId: string, formData: FormData | PlainFormData): Promise<ISystemRequirement> {
    // Detectar si recibimos datos en formato plano o anidado
    console.log("Datos recibidos para crear:", formData);
    
    // Si ya tiene los campos directos, asumir que es formato plano
    if ('name' in formData && formData.name !== undefined) {
      console.log("Recibidos datos en formato plano");
      const plainData = formData as PlainFormData;
      plainData.userId = userId;
      return await createSystemRequirement(plainData);
    } 
    // Si tiene estructura anidada, transformar a formato plano
    else if ('basicInfo' in formData) {
      console.log("Recibidos datos en formato anidado, transformando...");
      const data: PlainFormData = {
        userId,
        name: formData.basicInfo.projectName,
        description: formData.basicInfo.description,
        applicationType: formData.basicInfo.applicationType,
        functionalRequirements: formData.functionalRequirements,
        nonFunctionalRequirements: formData.nonFunctionalRequirements,
        techPreferences: formData.techPreferences,
        additionalContext: formData.additionalContext,
        status: "draft"
      };
      return await createSystemRequirement(data);
    }
    // Si no se puede determinar el formato, lanzar error
    else {
      console.error("Formato de datos desconocido:", formData);
      throw new Error("Formato de datos no reconocido");
    }
  },

  /**
   * Actualiza un requisito de sistema existente
   * @param id ID del requisito
   * @param userId ID del usuario
   * @param formData Datos del formulario
   * @returns El requisito actualizado
   */
  async update(id: string, userId: string, formData: FormData | PlainFormData): Promise<ISystemRequirement | null> {
    // Detectar si recibimos datos en formato plano o anidado
    console.log("Datos recibidos para actualizar:", formData);
    
    let updateData: Partial<PlainFormData> & { updated: Date };
    
    // Si ya tiene los campos directos, asumir que es formato plano
    if ('name' in formData && formData.name !== undefined) {
      console.log("Recibidos datos en formato plano para actualizar");
      updateData = {
        ...formData as PlainFormData,
        updated: new Date()
      };
    } 
    // Si tiene estructura anidada, transformar a formato plano
    else if ('basicInfo' in formData) {
      console.log("Recibidos datos en formato anidado para actualizar, transformando...");
      updateData = {
        name: formData.basicInfo.projectName,
        description: formData.basicInfo.description,
        applicationType: formData.basicInfo.applicationType,
        functionalRequirements: formData.functionalRequirements,
        nonFunctionalRequirements: formData.nonFunctionalRequirements,
        techPreferences: formData.techPreferences,
        additionalContext: formData.additionalContext,
        updated: new Date()
      };
    }
    // Si no se puede determinar el formato, lanzar error
    else {
      console.error("Formato de datos desconocido para actualizar:", formData);
      throw new Error("Formato de datos no reconocido");
    }
    
    return await updateSystemRequirementById(id, updateData);
  },

  /**
   * Obtiene un requisito por su ID
   * @param id ID del requisito
   * @param userId ID del usuario
   * @returns El requisito si existe
   */
  async getById(id: string, userId: string): Promise<ISystemRequirement | null> {
    
    return await getSystemRequirementById(id, userId);
  },

  /**
   * Obtiene todos los requisitos de un usuario
   * @param userId ID del usuario
   * @returns Lista de requisitos
   */
  async getAllByUser(userId: string): Promise<ISystemRequirement[]> {
    //await connectDB();
    const requirements = await getSystemRequirementsByUserId(userId);
    return requirements.map(req => req as ISystemRequirement);
  },

  /**
   * Elimina un requisito
   * @param id ID del requisito
   * @param userId ID del usuario
   * @returns true si fue eliminado, false si no
   */
  async delete(id: string, userId: string): Promise<boolean> {
    //await connectDB();
    console.log("deleting..", id, userId);
    const result = await deleteSystemRequirementById(id);
    return result.deletedCount > 0;
  },

  /**
   * Actualiza el estado de un requisito
   * @param id ID del requisito
   * @param userId ID del usuario
   * @param status Nuevo estado
   * @returns El requisito actualizado
   */
  async updateStatus(
    id: string, 
    userId: string, 
    status: "draft" | "completed" | "generating" | "failed"
  ): Promise<ISystemRequirement | null> {
    //await connectDB();
    return await updateSystemRequirementById(id, { status, updated: new Date() });
  
  },

  /**
   * Actualiza la URL del diagrama generado
   * @param id ID del requisito
   * @param userId ID del usuario
   * @param diagramUrl URL del diagrama
   * @returns El requisito actualizado
   */
  async updateDiagramUrl(
    id: string,
    userId: string,
    diagramUrl: string
  ): Promise<ISystemRequirement | null> {

    return await updateSystemRequirementById(id,{
      diagramUrl,
      status: "completed",
      updated: new Date()
    })
    //await connectDB();
    /* return SystemRequirement.findOneAndUpdate(
      { _id: id, userId },
      { diagramUrl, status: "completed", updated: new Date() },
      { new: true }
    ); */
  },

  /**
   * Convierte un documento de requisito a formato FormData
   * @param systemRequirement Documento de requisito
   * @returns Datos en formato FormData
   */
  toFormData(systemRequirement: ISystemRequirement): FormData {
    return {
      basicInfo: {
        projectName: systemRequirement.name || "",
        description: systemRequirement.description || "",
        applicationType: systemRequirement.applicationType || "",
      },
      functionalRequirements: systemRequirement.functionalRequirements || [],
      nonFunctionalRequirements: {
        scalability: systemRequirement.nonFunctionalRequirements?.scalability || "",
        availability: systemRequirement.nonFunctionalRequirements?.availability || "",
        security: systemRequirement.nonFunctionalRequirements?.security || "",
        performance: systemRequirement.nonFunctionalRequirements?.performance || ""
      },
      techPreferences: {
        backendLanguage: systemRequirement.techPreferences?.backendLanguage || "",
        frameworks: systemRequirement.techPreferences?.frameworks || [],
        databases: systemRequirement.techPreferences?.databases || [],
        architecture: systemRequirement.techPreferences?.architecture || ""
      },
      additionalContext: systemRequirement.additionalContext || ""
    };
  }
};
