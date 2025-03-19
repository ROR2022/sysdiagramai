import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
//import clientPromise from '@/libs/mongo';
//import { ObjectId } from 'mongodb';
import connectDB from "@/libs/mongoose";
import { SystemRequirement } from "@/libs/models/systemRequirement";

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";

/**
 * GET /api/requirements/[id]
 * Obtiene un requisito específico por ID
 */


// Define the correct type for the params

export async function GET(
  request: NextRequest,
) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const listUrl = request.nextUrl.pathname.split('/');
    console.log('listUrl:..', listUrl);
    const id = listUrl[listUrl.length - 1];
    // Obtener el ID del requisito de los parámetros de ruta
    const requirementId = id;
    
    if (!requirementId) {
      return NextResponse.json(
        { error: "ID de requisito no proporcionado" },
        { status: 400 }
      );
    }
    
    // Conectar a la base de datos
    await connectDB();
    //const db = client.db();
    
    // Buscar el requisito por ID
    const requirement = await SystemRequirement.findOne({
      _id: id,
      userId: session.user.id
    });
    
    if (!requirement) {
      return NextResponse.json(
        { error: "Requisito no encontrado" },
        { status: 404 }
      );
    }
    
    // Retornar el requisito
    return NextResponse.json(requirement);
    
  } catch (error: unknown) {
    console.error("Error al obtener requisito:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al obtener el requisito", details: errorMessage },
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
) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const listUrl = request.nextUrl.pathname.split('/');
    const id = listUrl[listUrl.length - 1];
    // Obtener el ID del requisito de los parámetros de ruta
    const requirementId = id;
    
    if (!requirementId) {
      return NextResponse.json(
        { error: "ID de requisito no proporcionado" },
        { status: 400 }
      );
    }
    
    // Obtener los datos del cuerpo de la solicitud
    const data = await request.json();
    
    // Conectar a la base de datos
    await connectDB();
    
    // Verificar que el requisito exista y pertenezca al usuario
    const existingRequirement = await SystemRequirement.findOne({
      _id: requirementId,
      userId: session.user.id
    });
    
    if (!existingRequirement) {
      return NextResponse.json(
        { error: "Requisito no encontrado o no autorizado" },
        { status: 404 }
      );
    }
    
    // Preparar los datos a actualizar
    const updateData = {
      ...data,
      updated: new Date(),
      userId: session.user.id
    };
    
    console.log(`Actualizando requisito con ID: ${requirementId}`, updateData);
    
    // Actualizar el requisito
    const updatedRequirement = await SystemRequirement.findOneAndUpdate(
      { _id: requirementId, userId: session.user.id },
      updateData,
      { new: true }
    );
    
    if (!updatedRequirement) {
      console.error(`No se pudo actualizar el requisito con ID: ${requirementId}`);
      return NextResponse.json(
        { error: "No se pudo actualizar el requisito" },
        { status: 500 }
      );
    }
    
    console.log(`Requisito actualizado exitosamente: ${requirementId}`);
    
    // Retornar el requisito actualizado
    return NextResponse.json(updatedRequirement);
    
  } catch (error: unknown) {
    console.error("Error al actualizar requisito:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al actualizar el requisito", details: errorMessage },
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
) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const listUrl = request.nextUrl.pathname.split('/');
    const id = listUrl[listUrl.length - 1];
    // Obtener el ID del requisito de los parámetros de ruta
    const requirementId = id;
    
    if (!requirementId) {
      return NextResponse.json(
        { error: "ID de requisito no proporcionado" },
        { status: 400 }
      );
    }
    
    // Conectar a la base de datos
    await connectDB();
    
    // Verificar que el requisito exista y pertenezca al usuario
    const existingRequirement = await SystemRequirement.findOne({
      _id: requirementId,
      userId: session.user.id
    });
    
    if (!existingRequirement) {
      return NextResponse.json(
        { error: "Requisito no encontrado o no autorizado" },
        { status: 404 }
      );
    }
    
    // Eliminar el requisito
    const result = await SystemRequirement.findByIdAndDelete(requirementId);
    
    if (!result) {
      return NextResponse.json(
        { error: "No se pudo eliminar el requisito" },
        { status: 500 }
      );
    }
    
    // Retornar éxito
    return NextResponse.json({
      success: true,
      message: "Requisito eliminado correctamente"
    });
    
  } catch (error: unknown) {
    console.error("Error al eliminar requisito:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al eliminar el requisito", details: errorMessage },
      { status: 500 }
    );
  }
}
