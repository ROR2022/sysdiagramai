import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { GenerationStatusService } from "@/libs/services/generationStatusService";

// Configurar para que este endpoint se ejecute en el entorno de Node.js
export const runtime = "nodejs";

/**
 * GET /api/diagrams/status?requirementId=xxx
 * Obtiene el estado actual de generación de diagramas para un requisito específico
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Obtener el ID del requisito de la URL como parámetro de consulta
    const { searchParams } = new URL(request.url);
    const requirementId = searchParams.get('requirementId');
    
    if (!requirementId) {
      return NextResponse.json(
        { error: "ID de requisito no proporcionado" },
        { status: 400 }
      );
    }
    
    console.log(`[API] Consultando estado para el requisito: ${requirementId}`);
    
    // Obtener el estado de generación actual
    const userId = session.user.id as string;
    const generationStatus = await GenerationStatusService.getStatus(requirementId, userId);
    
    if (!generationStatus) {
      console.log(`[API] No se encontró información de estado para: ${requirementId}`);
      return NextResponse.json(
        { 
          requirementId,
          status: "not_found",
          message: "No hay información de generación para este requisito" 
        },
        { status: 404 }
      );
    }
    
    console.log(`[API] Estado encontrado para ${requirementId}: ${generationStatus.status}`);
    
    // Formatear respuesta para el cliente
    return NextResponse.json({
      requirementId: generationStatus.requirementId,
      status: generationStatus.status,
      startTime: generationStatus.startTime,
      endTime: generationStatus.endTime,
      progress: generationStatus.progress || 0,
      error: generationStatus.error,
      // Incluir solo los últimos 10 logs para no sobrecargar la respuesta
      recentLogs: (generationStatus.logs || [])
        .slice(-10)
        .map(log => ({
          timestamp: log.timestamp,
          message: log.message,
          level: log.level
        }))
    });
    
  } catch (error: unknown) {
    console.error("Error al obtener estado de generación:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al obtener el estado de generación", details: errorMessage },
      { status: 500 }
    );
  }
} 