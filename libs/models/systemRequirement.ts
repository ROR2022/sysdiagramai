import mongoose, { Schema, Document } from "mongoose";
import { FormData } from "@/app/dashboard/create/components/types";

// Interfaz para el contenido de los diagramas
export interface DiagramContent {
  title: string;          // Título del diagrama
  description: string;    // Descripción breve
  diagramText: string;    // Contenido del diagrama (Mermaid/ASCII)
  explanation: string;    // Explicación detallada
  url: string;            // URL para acceso rápido
}

// Interface que extiende Document de Mongoose
export interface ISystemRequirement extends Document {
  _id: string;
  userId: string;
  created: Date;
  updated: Date;
  status: "draft" | "completed" | "generating" | "failed";
  name: string;
  description: string;
  applicationType: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: {
    scalability: string;
    availability: string;
    security: string;
    performance: string;
  };
  techPreferences: {
    backendLanguage: string;
    frameworks: string[];
    databases: string[];
    architecture: string;
  };
  additionalContext: string;
  diagramUrls?: string[];
  diagrams?: DiagramContent[];    // Nuevo campo para almacenar contenido completo de diagramas
  designDocument?: string;        // Documento completo de diseño
}

// Schema de Mongoose
const SystemRequirementSchema = new Schema<ISystemRequirement>({
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  created: { 
    type: Date, 
    default: Date.now 
  },
  updated: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ["draft", "completed", "generating", "failed"],
    default: "draft" 
  },
  name: { 
    type: String,
  },
  description: { 
    type: String,
  },
  applicationType: { 
    type: String,
  },
  functionalRequirements: [{ 
    type: String
  }],
  nonFunctionalRequirements: {
    scalability: { 
      type: String,
    },
    availability: { 
      type: String,
    },
    security: { 
      type: String,
    },
    performance: { 
      type: String,
    }
  },
  techPreferences: {
    backendLanguage: { 
      type: String,
    },
    frameworks: [{ 
      type: String
    }],
    databases: [{ 
      type: String
    }],
    architecture: { 
      type: String
    }
  },
  additionalContext: { 
    type: String
  },
  diagramUrls: [{ 
    type: String
  }],
  // Nuevos campos para almacenar contenido completo
  diagrams: [{
    title: { type: String },
    description: { type: String },
    diagramText: { type: String },
    explanation: { type: String },
    url: { type: String }
  }],
  designDocument: {
    type: String
  }
}, {
  timestamps: { 
    createdAt: 'created', 
    updatedAt: 'updated' 
  }
});

// Método estático para convertir FormData a formato de documento
SystemRequirementSchema.statics.fromFormData = function(userId: string, formData: FormData) {
  return {
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
};

// Creamos el modelo si no existe (evita errores en hot reload)
export const SystemRequirement = mongoose.models.SystemRequirement || 
  mongoose.model<ISystemRequirement>("SystemRequirement", SystemRequirementSchema);
