import { NextRequest, NextResponse } from 'next/server';
import { DiagramService } from '@/libs/services/diagramService';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/diagrams/generate
 * Inicia el proceso de generación de diagramas para un requisito específico
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // 2. Extraer datos del cuerpo de la solicitud
    const body = await request.json();
    const { requirementId } = body;

    if (!requirementId) {
      return NextResponse.json(
        { error: 'ID de requisito requerido' },
        { status: 400 }
      );
    }

    // 3. Llamar al servicio para generar diagramas
    const userId = session.user.id as string;
    const updatedRequirement = await DiagramService.generateDiagrams(requirementId, userId);

    // 4. Devolver el requisito actualizado con los diagramas
    return NextResponse.json({ 
      requirement: updatedRequirement,
      message: 'Diagramas generados exitosamente' 
    });
    
  } catch (error: unknown) {
    console.error('Error al generar diagramas:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al generar diagramas' },
      { status: 500 }
    );
  }
}
