import connectDB from "@/libs/mongoose";
import { ISystemRequirement, SystemRequirement } from "@/libs/models/systemRequirement";
// Funciones auxiliares para la gestión de requisitos del sistema

// find one by id and userId
export async function getSystemRequirementById(id: string, userId: string) {
    try {
        await connectDB();
        const systemRequirement = await SystemRequirement.findOne({ _id: id, userId });
        return systemRequirement;
    } catch (error) {
        console.error('Error al obtener el requisito del sistema:', error);
        throw error;
    }
}

// find all by userId
export async function getSystemRequirementsByUserId(userId: string) {
    try {
        await connectDB();
        const systemRequirements = await SystemRequirement.find({ userId }).sort({ updated: -1 }).lean();
        return systemRequirements;
    } catch (error) {
        console.error('Error al obtener los requisitos del sistema:', error);
        throw error;
    }
}

// update one by id, el data sera un objeto con los campos a actualizar que puede ser parcial
export async function updateSystemRequirementById(id: string, data: ISystemRequirement) {
    try {
        await connectDB();
        const systemRequirement = await SystemRequirement.findByIdAndUpdate(id, data, { new: true });
        return systemRequirement;
    } catch (error) {
        console.error('Error al actualizar el requisito del sistema:', error);
        throw error;
    }
}

// create one
export async function createSystemRequirement(data: ISystemRequirement) {
    try {
        await connectDB();
        const systemRequirement = await SystemRequirement.create(data);
        return systemRequirement;
    } catch (error) {
        console.error('Error al crear el requisito del sistema:', error);
        throw error;
    }
}

// delete one by id
export async function deleteSystemRequirementById(id: string) {
    try {
        await connectDB();
        const systemRequirement = await SystemRequirement.findByIdAndDelete(id);
        return systemRequirement;
    } catch (error) {
        console.error('Error al eliminar el requisito del sistema:', error);
        throw error;
    }
}
