import { NextResponse } from 'next/server';
import clientPromise, { checkMongoConnection } from '@/libs/mongo';

// Declaramos explícitamente que este código debe ejecutarse en el entorno Node.js
export const runtime = 'nodejs';

// Endpoint de diagnóstico para probar la conexión con MongoDB
export async function GET() {
  console.log("[API] Iniciando diagnóstico de conexión MongoDB...");
  
  try {
    // Verificar conexión básica
    const isConnected = await checkMongoConnection();
    
    if (!isConnected) {
      return NextResponse.json({ 
        error: "No se pudo conectar a MongoDB" 
      }, { status: 500 });
    }
    
    // Obtener información del servidor y listar bases de datos
    const client = await clientPromise;
    const serverInfo = await client.db("admin").command({ serverStatus: 1 });
    const adminDb = client.db("admin");
    const dbs = await adminDb.admin().listDatabases();
    
    return NextResponse.json({ 
      status: "Conectado a MongoDB correctamente",
      serverInfo: {
        version: serverInfo.version,
        uptime: serverInfo.uptime,
        connections: serverInfo.connections
      },
      databases: dbs.databases.map(db => db.name)
    });
  } catch (error: unknown) {
    console.error("[API] Error en diagnóstico MongoDB:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      error: "Error al realizar diagnóstico de MongoDB",
      details: errorMessage
    }, { status: 500 });
  }
} 