import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";
import { hash } from "bcrypt";

// Función para obtener el perfil del usuario
export async function GET() {
  try {
    // Verificar la autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Conectar a la base de datos
    const client = await clientPromise;
    const db = client.db();
    
    // Buscar el usuario por ID
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { password: 0 } } // Excluir la contraseña
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    
    // Retornar los datos del usuario
    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified
    });
    
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return NextResponse.json(
      { error: "Error al obtener el perfil" },
      { status: 500 }
    );
  }
}

// Función para actualizar el perfil del usuario
export async function PUT(request: NextRequest) {
  try {
    // Verificar la autenticación
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Obtener los datos del cuerpo de la solicitud
    const data = await request.json();
    
    // Validar los datos
    if (!data.name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }
    
    // Preparar los datos a actualizar
    const updateData: {
      name: string;
      password?: string;
      image?: string;
    } = {
      name: data.name,
    };
    
    // Si se proporciona una nueva contraseña, hashearla
    if (data.password && data.password.trim() !== "") {
      updateData.password = await hash(data.password, 10);
    }
    
    // Si se proporciona una nueva imagen, actualizarla
    if (data.image) {
      updateData.image = data.image;
    }
    
    // Conectar a la base de datos
    const client = await clientPromise;
    const db = client.db();
    
    // Actualizar el usuario
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    
    // Retornar éxito
    return NextResponse.json({
      success: true,
      message: "Perfil actualizado correctamente"
    });
    
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    return NextResponse.json(
      { error: "Error al actualizar el perfil" },
      { status: 500 }
    );
  }
} 