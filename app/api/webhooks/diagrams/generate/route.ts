import { NextResponse } from 'next/server';
import { DiagramService } from '@/libs/services/diagramService';
import connectDB from '@/libs/mongoose';

// Configurar para que este endpoint se ejecute en el entorno de Node.js
export const runtime = 'nodejs';

// Una lista simple para almacenar tokens válidos (en producción se usaría una base de datos o caché)
const validTokens = new Set<string>();

// POST: Manejar la solicitud de generación de diagramas
export async function POST(request: Request) {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    const { requirementId, userId, token } = await request.json();

    // Validar parámetros requeridos
    if (!requirementId || !userId) {
      return NextResponse.json({ 
        error: 'Faltan parámetros requeridos (requirementId o userId)' 
      }, { status: 400 });
    }

    // Validar el token o añadirlo a la lista de tokens válidos
    // En una implementación real, usaríamos un sistema más robusto de validación
    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    } else {
      // En implementación real, validaríamos el token contra una base de datos o servicio
      validTokens.add(token); // Simulamos validación por ahora
    }

    console.log(`Iniciando generación de diagramas para el requisito: ${requirementId}`);

    // Generar los diagramas utilizando el servicio
    const updatedRequirement = await DiagramService.generateDiagrams(requirementId, userId);

    if (!updatedRequirement) {
      return NextResponse.json({ 
        error: 'No se pudo actualizar el requisito' 
      }, { status: 500 });
    }

    // Eliminar el token utilizado
    validTokens.delete(token);

    return NextResponse.json({ 
      success: true, 
      message: 'Diagramas generados correctamente',
      requirementId
    });
  } catch (error) {
    console.error('Error en el webhook de generación de diagramas:', error);
    return NextResponse.json({ 
      error: 'Error al procesar la generación de diagramas', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 