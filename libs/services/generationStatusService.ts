import { GenerationStatus, IGenerationStatus, GenerationStatusType } from "../models/generationStatus";
import connectDB from "../mongoose";
import crypto from "crypto";

/**
 * Servicio para gestionar el estado de las generaciones de diagramas
 */
export class GenerationStatusService {
  /**
   * Inicia un nuevo proceso de generación
   * @param requirementId ID del requisito
   * @param userId ID del usuario
   * @returns El estado de generación creado
   */
  static async initGeneration(requirementId: string, userId: string): Promise<IGenerationStatus> {
    await connectDB();

    // Verificar si ya existe un proceso de generación en curso
    const existingStatus = await GenerationStatus.findOne({
      requirementId,
      userId,
      status: { $in: ["pending", "in_progress"] }
    });

    if (existingStatus) {
      // Si hay un proceso pendiente o en curso, actualizarlo para reiniciar
      existingStatus.status = "pending";
      existingStatus.startTime = new Date();
      existingStatus.endTime = undefined;
      existingStatus.error = undefined;
      existingStatus.logs = [];
      existingStatus.requestToken = this.generateToken();
      
      await existingStatus.save();
      return existingStatus;
    }

    // Crear un nuevo registro de estado
    const generationStatus = new GenerationStatus({
      requirementId,
      userId,
      status: "pending",
      startTime: new Date(),
      logs: [{
        timestamp: new Date(),
        message: "Generación de diagramas iniciada",
        level: "info"
      }],
      requestToken: this.generateToken()
    });

    await generationStatus.save();
    return generationStatus;
  }

  /**
   * Actualiza el estado de un proceso de generación
   * @param requirementId ID del requisito
   * @param userId ID del usuario
   * @param status Nuevo estado
   * @param message Mensaje opcional para el log
   * @returns El estado actualizado
   */
  static async updateStatus(
    requirementId: string,
    userId: string,
    status: GenerationStatusType,
    message?: string
  ): Promise<IGenerationStatus | null> {
    await connectDB();

    const generationStatus = await GenerationStatus.findOne({
      requirementId,
      userId
    });

    if (!generationStatus) {
      return null;
    }

    generationStatus.updateStatus(status, message);
    await generationStatus.save();
    return generationStatus;
  }

  /**
   * Registra un error en el proceso de generación
   * @param requirementId ID del requisito
   * @param userId ID del usuario
   * @param error Error ocurrido
   * @returns El estado actualizado
   */
  static async setError(
    requirementId: string,
    userId: string,
    error: Error | string
  ): Promise<IGenerationStatus | null> {
    await connectDB();

    const generationStatus = await GenerationStatus.findOne({
      requirementId,
      userId
    });

    if (!generationStatus) {
      return null;
    }

    generationStatus.setError(error);
    await generationStatus.save();
    return generationStatus;
  }

  /**
   * Obtiene el estado actual de un proceso de generación
   * @param requirementId ID del requisito
   * @param userId ID del usuario
   * @returns El estado actual
   */
  static async getStatus(
    requirementId: string,
    userId: string
  ): Promise<IGenerationStatus | null> {
    await connectDB();
    return GenerationStatus.findOne({
      requirementId,
      userId
    });
  }

  /**
   * Genera un token único para la solicitud
   * @returns Token generado
   */
  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Verifica si un token es válido para un proceso de generación
   * @param requirementId ID del requisito
   * @param userId ID del usuario
   * @param token Token a verificar
   * @returns true si el token es válido
   */
  static async verifyToken(
    requirementId: string,
    userId: string,
    token: string
  ): Promise<boolean> {
    await connectDB();

    const generationStatus = await GenerationStatus.findOne({
      requirementId,
      userId
    });

    if (!generationStatus || !generationStatus.requestToken) {
      return false;
    }

    return generationStatus.requestToken === token;
  }

  /**
   * Incrementa el contador de reintentos para un proceso de generación
   * @param requirementId ID del requisito
   * @param userId ID del usuario
   * @returns El estado actualizado
   */
  static async incrementRetry(
    requirementId: string,
    userId: string
  ): Promise<IGenerationStatus | null> {
    await connectDB();

    const generationStatus = await GenerationStatus.findOne({
      requirementId,
      userId
    });

    if (!generationStatus) {
      return null;
    }

    generationStatus.incrementRetry();
    generationStatus.status = "pending";
    generationStatus.addLog("Reintentando generación de diagramas", "info");
    
    await generationStatus.save();
    return generationStatus;
  }

  /**
   * Añade un log al proceso de generación
   * @param requirementId ID del requisito
   * @param userId ID del usuario
   * @param message Mensaje para el log
   * @param level Nivel del log
   * @returns El estado actualizado
   */
  static async addLog(
    requirementId: string,
    userId: string,
    message: string,
    level: "info" | "warn" | "error" = "info"
  ): Promise<IGenerationStatus | null> {
    await connectDB();

    const generationStatus = await GenerationStatus.findOne({
      requirementId,
      userId
    });

    if (!generationStatus) {
      return null;
    }

    generationStatus.addLog(message, level);
    await generationStatus.save();
    return generationStatus;
  }
} 