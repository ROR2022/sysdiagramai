import { MongoClient, ServerApiVersion } from "mongodb";

  if (!process.env.MONGO_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
  }
  
  const uri = process.env.MONGO_URI;
  const options = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  };
  
  let client;
  let clientPromise: Promise<MongoClient>;
  
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise: Promise<MongoClient> | undefined;
    };
    globalWithMongo._mongoClientPromise = undefined;
  
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  
  export default clientPromise;


/* import { MongoClient } from "mongodb";

// Verificar que MONGO_URI esté definido
if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

// Obtener la cadena de conexión
const uri = process.env.MONGO_URI;
console.log("Cadena de conexión MongoDB:", uri);

// Opciones de conexión optimizadas para evitar timeouts y errores comunes
const options = {
  maxPoolSize: 10,
  minPoolSize: 3,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
  retryWrites: true
};

// Interfaz para extender el objeto global
interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

// Variable para almacenar la instancia de MongoClient
let client: MongoClient;
// Variable para almacenar la promesa de conexión
let clientPromise: Promise<MongoClient>;

// Función para crear una nueva conexión
function createMongoClient() {
  client = new MongoClient(uri, options);
  return client.connect();
}

// Configurar la conexión según el entorno
if (process.env.NODE_ENV === "development") {
  // En desarrollo, usamos una variable global para mantener la conexión entre recargas
  // Esto permite compartir la conexión entre las diferentes invocaciones de la API
  const globalWithMongo = global as unknown as GlobalWithMongo;
  
  if (!globalWithMongo._mongoClientPromise) {
    console.log("[MongoDB] Creando nueva conexión en desarrollo");
    globalWithMongo._mongoClientPromise = createMongoClient();
  } else {
    console.log("[MongoDB] Reutilizando conexión existente en desarrollo");
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En producción, creamos una nueva conexión
  console.log("[MongoDB] Creando nueva conexión en producción");
  clientPromise = createMongoClient();
}

// Función para verificar la conexión a MongoDB
export const checkMongoConnection = async (): Promise<boolean> => {
  try {
    console.log("[MongoDB] Verificando conexión...");
    const client = await clientPromise;
    // Ejecutar un comando simple para verificar que la conexión está activa
    await client.db("admin").command({ ping: 1 });
    console.log("[MongoDB] ✅ Conexión verificada correctamente");
    return true;
  } catch (error) {
    console.error("[MongoDB] ❌ Error al verificar conexión:", error);
    return false;
  }
};

// Exportar la promesa del cliente para ser utilizada en toda la aplicación
export default clientPromise; */