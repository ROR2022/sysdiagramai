import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GenerationStatusService } from '@/libs/services/generationStatusService';

export const runtime = 'nodejs';

/**
 * POST /api/diagrams/status/init
 * Inicializa o recupera el estado de generación para un requisito específico
 */
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Obtener ID del requisito del cuerpo
    const { requirementId } = await request.json();
    
    if (!requirementId) {
      return NextResponse.json(
        { error: "ID de requisito no proporcionado" },
        { status: 400 }
      );
    }
    
    const userId = session.user.id as string;
    
    // Intentar obtener el estado existente
    let generationStatus = await GenerationStatusService.getStatus(requirementId, userId);
    
    // Si no existe estado, inicializarlo
    if (!generationStatus) {
      console.log(`[API] Inicializando estado de generación para requisito: ${requirementId}`);
      generationStatus = await GenerationStatusService.initGeneration(requirementId, userId);
      console.log(`[API] Estado de generación inicializado con éxito: ${requirementId}, estado: ${generationStatus.status}`);
    } else {
      console.log(`[API] Estado de generación existente recuperado: ${requirementId}, estado: ${generationStatus.status}`);
    }
    
    return NextResponse.json({
      requirementId: generationStatus.requirementId,
      status: generationStatus.status,
      startTime: generationStatus.startTime,
      endTime: generationStatus.endTime,
      progress: generationStatus.progress || 0,
      error: generationStatus.error,
      recentLogs: (generationStatus.logs || [])
        .slice(-10)
        .map(log => ({
          timestamp: log.timestamp,
          message: log.message,
          level: log.level
        }))
    });
    
  } catch (error: unknown) {
    console.error("Error al inicializar estado de generación:", error);
    return NextResponse.json(
      { 
        error: "Error al inicializar estado de generación", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 