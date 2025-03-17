// Funciones utilitarias para la suscripción con el fin de manejar el acceso 
// a la base de datos solo dentro de la carpeta api

import connectDB from "@/libs/mongoose";
import { ISubscription, Subscription } from "@/libs/models/subscription";

// get all subscriptions
export async function getAllSubscriptions() {
    try {
        await connectDB();
        const subscriptions = await Subscription.find().lean();
        return subscriptions as unknown[] as ISubscription[];
    } catch (error) {
        console.error('Error al obtener todas las suscripciones:', error);
        throw error;
    }
}

// get subscription by id
export async function getSubscriptionById(id: string) {
    try {
        await connectDB();
        const subscription = await Subscription.findById(id).lean();
        return subscription as unknown as ISubscription;
    } catch (error) {
        console.error('Error al obtener la suscripción por ID:', error);
        throw error;
    }
}

// get subscription by userId
export async function getSubscriptionByUserId(userId: string) {
    try {
        await connectDB();
        const subscription = await Subscription.findOne({ userId }).lean();
        return subscription as unknown as ISubscription;
    } catch (error) {
        console.error('Error al obtener la suscripción por userId:', error);
        throw error;
    }
}

// get subscription by stripeCustomerId
export async function getSubscriptionByStripeCustomerId(stripeCustomerId: string) {
    try {
        await connectDB();
        const subscription = await Subscription.findOne({ stripeCustomerId }).lean();
        return subscription as unknown as ISubscription;
    } catch (error) {
        console.error('Error al obtener la suscripción por stripeCustomerId:', error);
        throw error;
    }
}


// create subscription
export async function createSubscription(subscription: ISubscription) {
    try {
        await connectDB();
        const newSubscription = await Subscription.create(subscription);
        return newSubscription as unknown as ISubscription;
    } catch (error) {
        console.error('Error al crear la suscripción:', error);
        throw error;
    }   
}

// update subscription by id
export async function updateSubscriptionById(id: string, subscription: ISubscription) {
    try {
        await connectDB();
        const updatedSubscription = await Subscription.findByIdAndUpdate(id, subscription, { new: true }).lean();
        return updatedSubscription as unknown as ISubscription;
    } catch (error) {
        console.error('Error al actualizar la suscripción por ID:', error);
        throw error;
    }
}

// delete subscription by id
export async function deleteSubscriptionById(id: string) {
    try {
        await connectDB();
        await Subscription.findByIdAndDelete(id);
        return true;
    } catch (error) {
        console.error('Error al eliminar la suscripción por ID:', error);
        throw error;
        }
}   

// delete subscription by userId
export async function deleteSubscriptionByUserId(userId: string) {
    try {
        await connectDB();
        await Subscription.findOneAndDelete({ userId });
        return true;
    } catch (error) {
        console.error('Error al eliminar la suscripción por userId:', error);
        throw error;
    }
}

// update subscription by userId
export async function updateSubscriptionByUserId(userId: string, subscription: ISubscription) {
    try {
        await connectDB();
        const updatedSubscription = await Subscription.findOneAndUpdate({ userId }, subscription, { new: true }).lean();
        return updatedSubscription as unknown as ISubscription;
    } catch (error) {
        console.error('Error al actualizar la suscripción por userId:', error);
        throw error;
    }
}