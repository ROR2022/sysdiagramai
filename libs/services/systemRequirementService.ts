import { SystemRequirement, ISystemRequirement } from "../models/systemRequirement";
import { FormData } from "@/app/dashboard/create/components/types";
import connectDB from "../mongoose";

// Servicio para manejar las operaciones con los requisitos del sistema
export const SystemRequirementService = {
  /**
   * Crea un nuevo requisito de sistema
   * @param userId ID del usuario
   * @param formData Datos del formulario
   * @returns El requisito creado
   */
  async create(userId: string, formData: FormData): Promise<ISystemRequirement> {
    await connectDB();
    
    const data = {
      userId,
      name: formData.basicInfo.projectName,
      description: formData.basicInfo.description,
      applicationType: formData.basicInfo.applicationType,
      functionalRequirements: formData.functionalRequirements,
      nonFunctionalRequirements: formData.nonFunctionalRequirements,
      techPreferences: formData.techPreferences,
      additionalContext: formData.additionalContext,
      status: "draft" as const
    };
    
    const systemRequirement = new SystemRequirement(data);
    await systemRequirement.save();
    return systemRequirement;
  },

  /**
   * Actualiza un requisito de sistema existente
   * @param id ID del requisito
   * @param userId ID del usuario
   * @param formData Datos del formulario
   * @returns El requisito actualizado
   */
  async update(id: string, userId: string, formData: FormData): Promise<ISystemRequirement | null> {
    await connectDB();
    
    const updateData = {
      name: formData.basicInfo.projectName,
      description: formData.basicInfo.description,
      applicationType: formData.basicInfo.applicationType,
      functionalRequirements: formData.functionalRequirements,
      nonFunctionalRequirements: formData.nonFunctionalRequirements,
      techPreferences: formData.techPreferences,
      additionalContext: formData.additionalContext,
      updated: new Date()
    };
    
    return SystemRequirement.findOneAndUpdate(
      { _id: id, userId }, 
      updateData,
      { new: true }
    );
  },

  /**
   * Obtiene un requisito por su ID
   * @param id ID del requisito
   * @param userId ID del usuario
   * @returns El requisito si existe
   */
  async getById(id: string, userId: string): Promise<ISystemRequirement | null> {
    await connectDB();
    return SystemRequirement.findOne({ _id: id, userId });
  },

  /**
   * Obtiene todos los requisitos de un usuario
   * @param userId ID del usuario
   * @returns Lista de requisitos
   */
  async getAllByUser(userId: string): Promise<ISystemRequirement[]> {
    await connectDB();
    return SystemRequirement.find({ userId }).sort({ updated: -1 });
  },

  /**
   * Elimina un requisito
   * @param id ID del requisito
   * @param userId ID del usuario
   * @returns true si fue eliminado, false si no
   */
  async delete(id: string, userId: string): Promise<boolean> {
    await connectDB();
    const result = await SystemRequirement.deleteOne({ _id: id, userId });
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
    await connectDB();
    return SystemRequirement.findOneAndUpdate(
      { _id: id, userId },
      { status, updated: new Date() },
      { new: true }
    );
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
    await connectDB();
    return SystemRequirement.findOneAndUpdate(
      { _id: id, userId },
      { diagramUrl, status: "completed", updated: new Date() },
      { new: true }
    );
  },

  /**
   * Convierte un documento de requisito a formato FormData
   * @param systemRequirement Documento de requisito
   * @returns Datos en formato FormData
   */
  toFormData(systemRequirement: ISystemRequirement): FormData {
    return {
      basicInfo: {
        projectName: systemRequirement.name,
        description: systemRequirement.description,
        applicationType: systemRequirement.applicationType,
      },
      functionalRequirements: systemRequirement.functionalRequirements,
      nonFunctionalRequirements: systemRequirement.nonFunctionalRequirements,
      techPreferences: systemRequirement.techPreferences,
      additionalContext: systemRequirement.additionalContext,
    };
  }
};
