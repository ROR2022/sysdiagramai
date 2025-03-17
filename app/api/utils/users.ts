/*
    Funciones auxiliares para la gestión de usuarios
    para la gestion de la conexion a la base de datos usemos el clientPromise   
    tambien todas las funciones deben ser asyncronas con try catch para manejar errores
*/

import clientPromise from '@/libs/mongo';
import { ObjectId } from 'mongodb';
export async function getUserByEmail(email: string) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection('users').findOne({ email });
        return user;
    } catch (error) {
        console.error('Error al obtener el usuario por email:', error);
        throw error;
    }
}

export async function getUserById(id: string) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        return user;
    } catch (error) {
        console.error('Error al obtener el usuario por id:', error);
        throw error;
    }
}



