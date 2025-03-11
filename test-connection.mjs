// Script para probar la conexión a MongoDB
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Configuración para cargar variables de entorno desde .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env.local') });

// Obtener la cadena de conexión desde las variables de entorno
const uri = process.env.MONGO_URI;
console.log("Intentando conectar a:", uri);

// Opciones de conexión mejoradas
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 60000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 60000,
  maxPoolSize: 10,
};

async function testConnection() {
  console.log("Iniciando prueba de conexión a MongoDB...");
  const client = new MongoClient(uri, options);
  
  try {
    // Conectar al cliente
    console.log("Intentando conectar...");
    await client.connect();
    console.log("Conexión exitosa a MongoDB!");
    
    // Listar bases de datos para verificar la conexión
    console.log("Listando bases de datos:");
    const databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    
    // Verificar específicamente la base de datos sysdiagramai
    const db = client.db("sysdiagramai");
    const collections = await db.listCollections().toArray();
    console.log("\nColecciones en la base de datos sysdiagramai:");
    if (collections.length === 0) {
      console.log(" - No hay colecciones todavía");
    } else {
      collections.forEach(collection => console.log(` - ${collection.name}`));
    }
    
    // Verificar si hay usuarios
    const users = await db.collection("users").find({}).toArray();
    console.log("\nUsuarios encontrados:", users.length);
    
    if (users.length > 0) {
      console.log("Primer usuario (datos parciales):");
      const user = users[0];
      console.log(` - ID: ${user._id}`);
      console.log(` - Email: ${user.email}`);
      console.log(` - Nombre: ${user.name || 'No especificado'}`);
    }
    
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
  } finally {
    // Cerrar la conexión
    await client.close();
    console.log("Conexión cerrada");
  }
}

testConnection().catch(console.error); 