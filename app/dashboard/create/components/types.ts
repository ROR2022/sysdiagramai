// Definición de tipos para la aplicación SysDiagramAI

// Tipos para la sección de información básica
export interface BasicInfoData {
  projectName: string;
  description: string;
  applicationType: string;
}

export interface BasicInfoSectionProps {
  data: BasicInfoData;
  updateData: (data: BasicInfoData) => void;
}

// Tipos para la sección de requisitos funcionales
export type FunctionalRequirementsData = string[];

export interface FunctionalRequirementsSectionProps {
  data: FunctionalRequirementsData;
  updateData: (data: FunctionalRequirementsData) => void;
}

// Tipos para la sección de requisitos no funcionales
export interface NonFunctionalRequirementsData {
  scalability: string;
  availability: string;
  security: string;
  performance: string;
}

export interface NonFunctionalRequirementsSectionProps {
  data: NonFunctionalRequirementsData;
  updateData: (data: NonFunctionalRequirementsData) => void;
}

// Tipos para la sección de preferencias tecnológicas
export interface TechPreferencesData {
  backendLanguage: string;
  frameworks: string[];
  databases: string[];
  architecture: string;
}

export interface TechPreferencesSectionProps {
  data: TechPreferencesData;
  updateData: (data: TechPreferencesData) => void;
}

// Tipos para la sección de contexto adicional
export type AdditionalContextData = string;

export interface AdditionalContextSectionProps {
  data: AdditionalContextData;
  updateData: (data: AdditionalContextData) => void;
}

// Tipo para el formulario completo
export interface FormData {
  basicInfo: BasicInfoData;
  functionalRequirements: FunctionalRequirementsData;
  nonFunctionalRequirements: NonFunctionalRequirementsData;
  techPreferences: TechPreferencesData;
  additionalContext: AdditionalContextData;
}

// Tipos para la sección de revisión
export interface ReviewSectionProps {
  data: FormData;
  onEdit: (step: number) => void;
}

// Tipos para el formulario principal
export interface SystemRequirementsFormProps {
  initialData?: FormData;
  onSubmit?: (data: FormData) => void;
  requirementId?: string; // ID del requisito en la base de datos (si existe)
}
