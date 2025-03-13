import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { SystemRequirement } from '@/libs/models/systemRequirement';

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }
    
    // Extraer el ID antes de usarlo
    const id = String(params.id);
    
    // Obtener el requisito de la base de datos
    const requirement = await SystemRequirement.findOne({
      _id: id,
      userId: session.user?.id
    });
    
    if (!requirement) {
      return NextResponse.json(
        { error: 'Diagrama no encontrado o no autorizado' },
        { status: 404 }
      );
    }
    
    // Verificar si el requisito tiene diagramas
    if (requirement.status !== 'completed' || !requirement.diagrams || requirement.diagrams.length === 0) {
      return NextResponse.json(
        { 
          error: 'No hay diagramas disponibles para este requisito',
          status: requirement.status
        },
        { status: 404 }
      );
    }
    
    // Devolver los diagramas y el documento de diseño
    return NextResponse.json({
      id: requirement._id,
      name: requirement.name,
      description: requirement.description,
      status: requirement.status,
      diagrams: requirement.diagrams,
      designDocument: requirement.designDocument,
      diagramUrls: requirement.diagramUrls,
      createdAt: requirement.created,
      updatedAt: requirement.updated,
      userId: requirement.userId
    });
  } catch (error) {
    console.error('Error al obtener diagramas:', error);
    return NextResponse.json(
      { error: 'Error al recuperar el diagrama' },
      { status: 500 }
    );
  }
} 