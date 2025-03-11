import { NextResponse } from 'next/server';
import clientPromise, { checkMongoConnection } from '@/libs/mongo';

// Declaramos explícitamente que este código debe ejecutarse en el entorno Node.js
export const runtime = 'nodejs';

// Endpoint de diagnóstico para probar la conexión con MongoDB
export async function GET() {
  console.log("🔄 Iniciando diagnóstico de conexión a MongoDB...");
  
  try {
    // Verificar conexión básica
    console.log("🔄 Verificando conexión básica...");
    const isConnected = await checkMongoConnection();
    
    if (!isConnected) {
      console.error("❌ Fallo en la verificación de conexión básica");
      return NextResponse.json({
        success: false,
        error: "La verificación básica de conexión falló",
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    console.log("✅ Verificación básica exitosa");
    
    // Obtener información del servidor
    console.log("🔄 Obteniendo información del servidor...");
    const client = await clientPromise;
    const adminDb = client.db("admin");
    
    // Información de construcción del servidor
    const buildInfo = await adminDb.command({ buildInfo: 1 });
    
    // Verificar la base de datos del proyecto
    console.log("🔄 Verificando la base de datos sysdiagramai...");
    const db = client.db("sysdiagramai");
    const collections = await db.listCollections().toArray();
    
    // Listar bases de datos disponibles
    console.log("🔄 Listando bases de datos disponibles...");
    const databasesList = await client.db().admin().listDatabases();
    
    return NextResponse.json({
      success: true,
      connection: {
        status: "connected",
        timestamp: new Date().toISOString()
      },
      serverInfo: {
        version: buildInfo.version,
        gitVersion: buildInfo.gitVersion
      },
      databases: databasesList.databases.map(db => ({
        name: db.name,
        sizeOnDisk: db.sizeOnDisk
      })),
      sysdiagramaiDatabase: {
        collections: collections.map(col => col.name)
      }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error durante el diagnóstico:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 