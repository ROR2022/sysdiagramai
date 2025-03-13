import mongoose from 'mongoose';

// Verificar que la variable de entorno MONGODB_URI esté definida
if (!process.env.MONGODB_URI) {
  console.error('La variable de entorno MONGODB_URI no está definida. Por favor, configúrala en tu archivo .env.local');
  // En desarrollo, usamos una URI por defecto para evitar errores, pero en producción esto debería fallar
  if (process.env.NODE_ENV === 'production') {
    throw new Error('La variable de entorno MONGODB_URI es obligatoria en producción');
  }
}

// Usar la cadena de conexión de MongoDB Atlas desde las variables de entorno
const MONGODB_URI = process.env.MONGODB_URI || '';

// Estado de la conexión de MongoDB
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Caché global para mantener la conexión entre recargas de Next.js
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection;
}

// En desarrollo, utilizamos una variable global para preservar la conexión
// entre recargas generadas por Hot Module Replacement (HMR)
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

/**
 * Conecta a MongoDB
 */
export default async function dbConnect(): Promise<typeof mongoose> {
  // Si no hay URI configurada, lanzar error
  if (!MONGODB_URI) {
    throw new Error('La cadena de conexión a MongoDB no está configurada. Verifica tu archivo .env.local');
  }

  // Si ya estamos conectados, reutilizamos la conexión
  if (global.mongoose.conn) {
    // Verificar si la conexión está activa
    if (mongoose.connection.readyState === 1) {
      console.log('Reutilizando conexión existente a MongoDB Atlas');
      return global.mongoose.conn;
    } else {
      // Resetear la conexión si no está activa
      global.mongoose.conn = null;
      global.mongoose.promise = null;
    }
  }

  // Si ya hay una promesa de conexión en curso, reutilizamos esa promesa
  if (!global.mongoose.promise) {
    // Opciones específicas para la conexión a MongoDB
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Tiempo de espera para selección de servidor
      socketTimeoutMS: 45000, // Tiempo de espera para operaciones de socket
    };

    console.log('Conectando a MongoDB Atlas...');
    
    // Iniciar la conexión
    global.mongoose.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('Conectado a MongoDB Atlas');
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('Error al conectar a MongoDB Atlas:', error);
        // Resetear la promesa para permitir futuros intentos
        global.mongoose.promise = null;
        throw error;
      });
  }

  try {
    // Esperar a que la conexión se establezca y almacenarla en el caché
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    // Si hay un error, limpiamos la promesa para que se pueda intentar de nuevo
    global.mongoose.promise = null;
    throw error;
  }
}
