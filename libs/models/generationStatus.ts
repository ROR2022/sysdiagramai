import mongoose, { Schema } from "mongoose";

// Posibles estados del proceso de generación
export type GenerationStatusType = 
  | "pending"      // Generación pendiente de iniciar
  | "in_progress"  // Generación en progreso
  | "completed"    // Generación completada con éxito 
  | "failed"       // Generación fallida
  | "timeout";     // Generación excedió el tiempo límite

// Interfaz para el modelo de estado de generación
export interface IGenerationStatus {
  _id?: string;
  requirementId: string;
  userId: string;
  status: GenerationStatusType;
  startTime?: Date;
  endTime?: Date;
  progress?: number;
  logs?: Array<{
    timestamp: Date;
    message: string;
    level: "info" | "warn" | "error";
  }>;
  error?: string;
  retryCount?: number;
  lastRetry?: Date;
  requestToken?: string;
}

// Schema de Mongoose
const GenerationStatusSchema = new Schema<IGenerationStatus>({
  requirementId: { 
    type: String, 
    required: true,
    index: true
  },
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  status: { 
    type: String, 
    enum: ["pending", "in_progress", "completed", "failed", "timeout"],
    default: "pending",
    index: true
  },
  startTime: { 
    type: Date
  },
  endTime: { 
    type: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100
  },
  logs: [{
    timestamp: { type: Date, default: Date.now },
    message: String,
    level: { 
      type: String, 
      enum: ["info", "warn", "error"],
      default: "info"
    }
  }],
  error: {
    type: String
  },
  retryCount: {
    type: Number,
    default: 0
  },
  lastRetry: {
    type: Date
  },
  requestToken: {
    type: String
  }
}, {
  timestamps: true
});

// Método para añadir un nuevo log
GenerationStatusSchema.methods.addLog = function(
  message: string, 
  level: "info" | "warn" | "error" = "info"
) {
  if (!this.logs) {
    this.logs = [];
  }
  
  this.logs.push({
    timestamp: new Date(),
    message,
    level
  });
  
  return this;
};

// Método para actualizar el estado
GenerationStatusSchema.methods.updateStatus = function(
  status: GenerationStatusType,
  message?: string
) {
  this.status = status;
  
  if (status === "in_progress" && !this.startTime) {
    this.startTime = new Date();
  }
  
  if (["completed", "failed", "timeout"].includes(status)) {
    this.endTime = new Date();
  }
  
  if (message) {
    this.addLog(message, status === "failed" || status === "timeout" ? "error" : "info");
  }
  
  return this;
};

// Método para registrar un error
GenerationStatusSchema.methods.setError = function(error: Error | string) {
  const errorMessage = error instanceof Error ? error.message : error;
  this.error = errorMessage;
  this.status = "failed";
  this.endTime = new Date();
  this.addLog(errorMessage, "error");
  return this;
};

// Método para incrementar el conteo de reintentos
GenerationStatusSchema.methods.incrementRetry = function() {
  this.retryCount = (this.retryCount || 0) + 1;
  this.lastRetry = new Date();
  return this;
};

// Creamos el modelo si no existe (evita errores en hot reload)
export const GenerationStatus = mongoose.models.GenerationStatus || 
  mongoose.model<IGenerationStatus>("GenerationStatus", GenerationStatusSchema); 