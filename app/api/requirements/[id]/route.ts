import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { SystemRequirement } from "@/libs/models/systemRequirement";
import { SystemRequirementService } from "@/libs/services/systemRequirementService";

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/requirements/[id]
 * Obtiene un requisito específico por ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
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
        { error: 'Requisito no encontrado o no autorizado' },
        { status: 404 }
      );
    }
    
    // Transformar los datos para el formulario
    const formData = SystemRequirementService.toFormData(requirement);
    
    // Devolver el requisito
    return NextResponse.json({
      id: requirement._id,
      status: requirement.status,
      created: requirement.created,
      updated: requirement.updated,
      diagramUrls: requirement.diagramUrls,
      ...formData
    });
  } catch (error) {
    console.error('Error al obtener requisito:', error);
    return NextResponse.json(
      { error: 'Error al recuperar el requisito' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/requirements/[id]
 * Actualiza un requisito existente
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
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
    
    // Obtener los datos del cuerpo de la solicitud
    const data = await request.json();
    
    // Verificar que el requisito existe y pertenece al usuario
    const existingRequirement = await SystemRequirement.findOne({
      _id: id,
      userId: session.user?.id
    });
    
    if (!existingRequirement) {
      return NextResponse.json(
        { error: 'Requisito no encontrado o no autorizado' },
        { status: 404 }
      );
    }
    
    // Actualizar el requisito
    const updatedRequirement = await SystemRequirementService.update(
      id,
      session.user?.id as string,
      data
    );
    
    return NextResponse.json(updatedRequirement);
  } catch (error) {
    console.error('Error al actualizar requisito:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el requisito' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/requirements/[id]
 * Elimina un requisito existente
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
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
    
    // Verificar que el requisito existe y pertenece al usuario
    const existingRequirement = await SystemRequirement.findOne({
      _id: id,
      userId: session.user?.id
    });
    
    if (!existingRequirement) {
      return NextResponse.json(
        { error: 'Requisito no encontrado o no autorizado' },
        { status: 404 }
      );
    }
    
    // Eliminar el requisito
    await SystemRequirement.deleteOne({
      _id: id,
      userId: session.user?.id
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar requisito:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el requisito' },
      { status: 500 }
    );
  }
}
