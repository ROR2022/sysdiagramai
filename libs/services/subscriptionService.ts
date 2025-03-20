import { ISubscription } from "../models/subscription";
import Stripe from "stripe";
//import clientPromise from "../mongo";
import {
  createSubscription,
  getSubscriptionByUserId,
  updateSubscriptionByUserId,
  getSubscriptionByStripeCustomerId,
} from "@/app/api/utils/subscription";
import { getUserByEmail, getUserById } from "@/app/api/utils/users";
import {
  createCustomerByUserId,
  createCustomerByUserIdAndEmail,
  createCheckoutSession as createStripeCheckoutSession,
  createBillingPortalSession as createStripeBillingPortalSession,
  cancelSubscriptionAtPeriodEnd,
  getStripeSubscriptionById,
  getStripeSubscriptionByEmail,
  getStripeSubscriptionByIdUser,
  stripe,
} from "@/app/api/utils/stripe";

// Servicio para manejar las operaciones con las suscripciones
export const SubscriptionService = {
  /**
   * Obtiene la suscripción de un usuario
   * @param userId ID del usuario
   * @returns La suscripción si existe
   */
  async getByUserId(userId: string): Promise<ISubscription | null> {
    const subscription = await getSubscriptionByUserId(userId);
    return subscription as ISubscription | null;
  },

  /**
   * Crea una suscripción gratuita para un usuario
   * @param userId ID del usuario
   * @param stripeCustomerId ID del cliente en Stripe (opcional)
   * @returns La suscripción creada
   */
  async createFreeSubscription(
    userId: string,
    stripeCustomerId?: string
  ): Promise<ISubscription> {
    // Si no se proporciona un ID de cliente, crear uno nuevo en Stripe
    if (!stripeCustomerId || stripeCustomerId.startsWith("temp_")) {
      try {
        // Intentar crear un cliente en Stripe directamente
        // esta funcion es exportada desde el archivo stripe.ts
        const customer = await createCustomerByUserId(userId);

        stripeCustomerId = customer.id;
        console.log(
          `Created Stripe customer for user ${userId}: ${stripeCustomerId}`
        );
      } catch (error) {
        console.error("Error creating Stripe customer:", error);
        // Si falla, usar un ID temporal
        stripeCustomerId = `temp_${userId}`;
      }
    }

    const subscription: ISubscription = {
      userId,
      stripeCustomerId,
      plan: "free",
      status: "active",
      diagramsUsed: 0,
      diagramsLimit: 3,
    };

    // Convertir a formato compatible con MongoDB
    const subscriptionDoc = {
      ...subscription,
      created: new Date(),
      updated: new Date(),
    };

    return await createSubscription(subscriptionDoc as ISubscription);
  },

  /**
   * Actualiza una suscripción existente
   * @param userId ID del usuario
   * @param data Datos a actualizar
   * @returns La suscripción actualizada
   */
  async updateSubscription(
    userId: string,
    data: Partial<ISubscription>
  ): Promise<ISubscription | null> {
    const dataToUpdate = { ...data, updated: new Date() } as ISubscription;

    const result = await updateSubscriptionByUserId(userId, dataToUpdate);

    return result as unknown as ISubscription | null;
  },

  /**
   * Incrementa el contador de diagramas usados
   * @param userId ID del usuario
   * @returns La suscripción actualizada
   */
  async incrementDiagramsUsed(userId: string): Promise<ISubscription | null> {
    /* const result = await db.collection("subscriptions").findOneAndUpdate(
      { userId },
      { $inc: { diagramsUsed: 1 }, $set: { updated: new Date() } },
      { returnDocument: "after" }
    ); */

    const subscription = (await getSubscriptionByUserId(
      userId
    )) as ISubscription;
    if (!subscription) return null;

    const updatedSubscription = {
      ...subscription,
      diagramsUsed: subscription.diagramsUsed + 1,
      updated: new Date(),
    } as unknown as ISubscription;

    return await updateSubscriptionByUserId(userId, updatedSubscription);
  },

  /**
   * Verifica si un usuario puede crear más diagramas
   * @param userId ID del usuario
   * @returns true si puede crear más diagramas, false si no
   */
  async canCreateDiagram(userId: string): Promise<boolean> {
    const subscription = await this.getByUserId(userId);

    if (!subscription) return false;

    return subscription.diagramsUsed < subscription.diagramsLimit;
  },

  /**
   * Crea una sesión de checkout para suscribirse a un plan
   * @param userId ID del usuario
   * @param priceId ID del precio en Stripe
   * @returns URL de la sesión de checkout
   */
  async createCheckoutSession(
    userId: string,
    priceId: string
  ): Promise<string> {
    // Guardar el estado original de la suscripción para poder restaurarlo en caso de error
    let originalSubscriptionState: Partial<ISubscription> | null = null;
    
    try {
      console.log(`[SubscriptionService] Iniciando creación de sesión de checkout para usuario ${userId}, priceId: ${priceId}`);
      
      let subscription = await this.getByUserId(userId);

      // Si el usuario no tiene una suscripción, crear una suscripción gratuita automáticamente
      if (!subscription) {
        console.log(`[SubscriptionService] Usuario nuevo detectado. Creando suscripción gratuita para ${userId}`);
        subscription = await this.createFreeSubscription(userId);
        console.log(`[SubscriptionService] Suscripción gratuita creada: ${JSON.stringify(subscription)}`);
      }
      
      // Guardar el estado original para poder restaurarlo en caso de error
      originalSubscriptionState = {
        status: subscription.status,
        plan: subscription.plan
      };
      
      console.log(`[SubscriptionService] Estado original de la suscripción: ${JSON.stringify(originalSubscriptionState)}`);

      // Verificar si la suscripción ya está en estado "processing"
      if (subscription.status === "processing") {
        // Si la última actualización fue hace menos de 5 minutos, esperamos a que se complete
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (subscription.lastPaymentAttempt && subscription.lastPaymentAttempt > fiveMinutesAgo) {
          console.log(`[SubscriptionService] La suscripción ya está en estado "processing" y el último intento fue reciente. Usuario: ${userId}`);
          throw new Error("Hay un proceso de pago en curso. Por favor, espera unos minutos antes de intentarlo de nuevo.");
        } else {
          // Si ha pasado más tiempo, asumimos que el proceso anterior falló y continuamos
          console.log(`[SubscriptionService] La suscripción estaba en estado "processing" pero el último intento fue hace más de 5 minutos. Continuando. Usuario: ${userId}`);
        }
      }

      // Actualizar el estado de la suscripción a 'processing' y registrar el intento de pago
      await this.updateSubscription(userId, {
        status: "processing",
        lastPaymentAttempt: new Date(),
      });
      
      console.log(`[SubscriptionService] Suscripción actualizada a estado "processing" para usuario ${userId}`);

      let customerId = subscription.stripeCustomerId;
      let user = null;

      // Verificar si el ID de cliente es válido (no debe ser un email o ID temporal)
      if (
        !customerId ||
        customerId.includes("@") ||
        customerId.startsWith("temp_")
      ) {
        try {
          console.log(`[SubscriptionService] CustomerId no válido o no existe: ${customerId}, creando nuevo cliente Stripe para usuario ${userId}`);
          
          // Obtener el usuario para conseguir su email
          user = await getUserById(userId);

          if (!user) {
            console.error(`[SubscriptionService] Usuario no encontrado: ${userId}`);
            throw new Error(`User not found for userId: ${userId}`);
          }

          if (!user.email) {
            console.error(`[SubscriptionService] Email no encontrado para usuario: ${userId}`);
            throw new Error(`Email not found for user: ${userId}`);
          }

          // Crear un nuevo cliente en Stripe
          const customer = await createCustomerByUserIdAndEmail(
            userId,
            user.email
          );

          customerId = customer.id;

          // Actualizar la suscripción con el nuevo ID de cliente
          await this.updateSubscription(userId, {
            stripeCustomerId: customerId,
          });

          console.log(
            `[SubscriptionService] Creado nuevo cliente Stripe para usuario ${userId}: ${customerId}`
          );
        } catch (error) {
          // En caso de error, restaurar el estado original de la suscripción
          if (originalSubscriptionState) {
            console.error(`[SubscriptionService] Error creando cliente Stripe, restaurando estado original: ${JSON.stringify(originalSubscriptionState)}`);
            await this.updateSubscription(userId, originalSubscriptionState);
          } else {
            // Si no tenemos el estado original, al menos volver a "active"
            console.error(`[SubscriptionService] Error creando cliente Stripe, restaurando a estado "active"`);
            await this.updateSubscription(userId, {
              status: "active",
            });
          }
          
          console.error(`[SubscriptionService] Error creando cliente Stripe:`, error);
          throw new Error(`Failed to create Stripe customer: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      // Asegurarse de que tenemos un email válido para la sesión de checkout
      if (!user) {
        user = await getUserById(userId);
      }

      if (!user || !user.email) {
        // En caso de error, restaurar el estado original de la suscripción
        if (originalSubscriptionState) {
          console.error(`[SubscriptionService] Email no válido, restaurando estado original: ${JSON.stringify(originalSubscriptionState)}`);
          await this.updateSubscription(userId, originalSubscriptionState);
        } else {
          console.error(`[SubscriptionService] Email no válido, restaurando a estado "active"`);
          await this.updateSubscription(userId, {
            status: "active",
          });
        }
        
        throw new Error(`No valid email found for user: ${userId}`);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        // En caso de error, restaurar el estado original de la suscripción
        if (originalSubscriptionState) {
          console.error(`[SubscriptionService] Formato de email inválido, restaurando estado original: ${JSON.stringify(originalSubscriptionState)}`);
          await this.updateSubscription(userId, originalSubscriptionState);
        } else {
          console.error(`[SubscriptionService] Formato de email inválido, restaurando a estado "active"`);
          await this.updateSubscription(userId, {
            status: "active",
          });
        }
        
        throw new Error(`Invalid email format for user: ${userId}, email: ${user.email}`);
      }

      console.log(`[SubscriptionService] Creando sesión de checkout para usuario: ${userId}, email: ${user.email}`);

      try {
        const session = await createStripeCheckoutSession({
          priceId,
          userId,
          email: user.email,
        });
        
        console.log(`[SubscriptionService] Sesión de checkout creada exitosamente para usuario ${userId}, sessionId: ${session.id}`);
        return session.url as string;
      } catch (error) {
        // En caso de error, restaurar el estado original de la suscripción
        if (originalSubscriptionState) {
          console.error(`[SubscriptionService] Error creando sesión de checkout, restaurando estado original: ${JSON.stringify(originalSubscriptionState)}`);
          await this.updateSubscription(userId, originalSubscriptionState);
        } else {
          console.error(`[SubscriptionService] Error creando sesión de checkout, restaurando a estado "active"`);
          await this.updateSubscription(userId, {
            status: "active",
          });
        }
        
        console.error(`[SubscriptionService] Error creando sesión de checkout:`, error);
        throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : String(error)}`);
      }
    } catch (error) {
      console.error(`[SubscriptionService] Error en createCheckoutSession:`, error);
      
      // Último intento de restaurar el estado si algo falló en el bloque principal
      if (originalSubscriptionState && userId) {
        try {
          console.error(`[SubscriptionService] Restaurando estado original como último recurso: ${JSON.stringify(originalSubscriptionState)}`);
          await this.updateSubscription(userId, originalSubscriptionState);
        } catch (restoreError) {
          console.error(`[SubscriptionService] Error al intentar restaurar estado original:`, restoreError);
        }
      }
      
      throw error; // Re-lanzar el error para manejarlo en el nivel superior
    }
  },

  /**
   * Crea una sesión del portal de facturación
   * @param userId ID del usuario
   * @returns URL de la sesión del portal
   */
  async createBillingPortalSession(userId: string): Promise<string> {
    const subscription = await this.getByUserId(userId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const session = await createStripeBillingPortalSession(
      subscription.stripeCustomerId
    );

    return session.url;
  },

  /**
   * Cancela la suscripción de un usuario
   * @param userId ID del usuario
   * @returns true si se canceló correctamente, false si no
   */
  async cancelSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getByUserId(userId);

    if (!subscription || !subscription.stripeSubscriptionId) {
      return false;
    }

    try {
      await cancelSubscriptionAtPeriodEnd(subscription.stripeSubscriptionId);

      await this.updateSubscription(userId, {
        status: "canceled",
      });

      return true;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      return false;
    }
  },

  /**
   * Actualiza la suscripción desde un evento de Stripe
   * @param event Evento de Stripe
   * @returns La suscripción actualizada
   */
  async handleStripeEvent(event: Stripe.Event): Promise<ISubscription | null> {
    let subscription: ISubscription | null = null;
    //let userId: string | undefined;

    console.log(`[SubscriptionService] Procesando evento Stripe: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[SubscriptionService] Session completada:", session.id);

        // Extraer información del usuario y su email
        let userId = session.metadata?.userId || session.client_reference_id;
        const userEmail = session.customer_details?.email || session.customer_email;
        const stripeCustomerId = session.customer as string;
        
        // Validar que tenemos información para identificar al usuario
        if (!userId && !userEmail && !stripeCustomerId) {
          console.error("[SubscriptionService] No se puede identificar al usuario en la sesión de checkout");
          return null;
        }
        
        // Si no tenemos userId pero tenemos email, intentar encontrar el usuario
        if (!userId && userEmail) {
          try {
            const user = await getUserByEmail(userEmail);
            if (user) {
              userId = user._id.toString();
              console.log(`[SubscriptionService] Usuario encontrado por email: ${userEmail}, userId: ${userId}`);
            }
          } catch (error) {
            console.error(`[SubscriptionService] Error buscando usuario por email ${userEmail}:`, error);
          }
        }
        
        // Si todavía no tenemos userId pero tenemos customerId, buscar por este
        if (!userId && stripeCustomerId) {
          try {
            const existingSubscription = await getSubscriptionByStripeCustomerId(stripeCustomerId);
            if (existingSubscription) {
              userId = existingSubscription.userId;
              console.log(`[SubscriptionService] Usuario encontrado por stripeCustomerId: ${stripeCustomerId}, userId: ${userId}`);
            }
          } catch (error) {
            console.error(`[SubscriptionService] Error buscando suscripción por stripeCustomerId ${stripeCustomerId}:`, error);
          }
        }
        
        // Verificar si finalmente tenemos un userId
        if (!userId) {
          console.error("[SubscriptionService] No userId found in session metadata or through alternative methods");
          return null;
        }

        // Verificar si la suscripción está en estado "processing" para evitar bucles
        const currentSubscription = await getSubscriptionByUserId(userId);
        if (currentSubscription && currentSubscription.status === "processing") {
          console.log(`[SubscriptionService] Suscripción en estado processing para usuario ${userId}, actualizando estado`);
          
          // Estrategia para obtener la suscripción de Stripe
          let stripeSubscription: Stripe.Subscription | null = null;
          
          // 1. Intentar obtener la suscripción con el id de la suscripción de la sesión
          if (session.subscription) {
            try {
              stripeSubscription = await getStripeSubscriptionById(session.subscription as string);
              console.log("[SubscriptionService] Suscripción de Stripe encontrada por ID:", session.subscription);
            } catch (error) {
              console.log("[SubscriptionService] Error obteniendo suscripción por ID:", error);
            }
          }
          
          // 2. Si no se encuentra, intentar con el email del usuario
          if (!stripeSubscription && userEmail) {
            try {
              stripeSubscription = await getStripeSubscriptionByEmail(userEmail);
              console.log("[SubscriptionService] Suscripción de Stripe encontrada por email:", userEmail);
            } catch (error) {
              console.log("[SubscriptionService] Error obteniendo suscripción por email:", error);
            }
          }
          
          // 3. Si todavía no se encuentra, intentar con el ID del usuario
          if (!stripeSubscription) {
            try {
              stripeSubscription = await getStripeSubscriptionByIdUser(userId);
              console.log("[SubscriptionService] Suscripción de Stripe encontrada por userId:", userId);
            } catch (error) {
              console.log("[SubscriptionService] Error obteniendo suscripción por userId:", error);
            }
          }
          
          // Si no encontramos la suscripción de Stripe pero la sesión se completó,
          // intentamos obtener información del plan a partir de la sesión
          if (!stripeSubscription) {
            console.log("[SubscriptionService] No se pudo encontrar la suscripción de Stripe, usando datos de la sesión");
            
            try {
              // Intentar obtener el ID del producto o precio desde la sesión
              if (session.line_items) {
                console.log("[SubscriptionService] Usando line_items de la sesión");
                // Si la sesión ya tiene line_items
                if (session.line_items.data && session.line_items.data.length > 0) {
                  const lineItem = session.line_items.data[0];
                  if (lineItem.price && lineItem.price.product) {
                    const productId = typeof lineItem.price.product === 'string' 
                      ? lineItem.price.product 
                      : lineItem.price.product.id;
                    
                    const plan = this.getPlanFromProductId(productId);
                    const limit = this.getLimitFromPlan(plan);
                    
                    // Actualizar la suscripción con la información disponible
                    subscription = await this.updateSubscription(userId, {
                      stripeCustomerId,
                      stripeSubscriptionId: session.subscription as string,
                      plan,
                      status: "active",
                      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 días por defecto
                      diagramsLimit: limit,
                      lastPaymentAttempt: new Date()
                    });
                    
                    console.log(`[SubscriptionService] Suscripción actualizada con datos de la sesión para usuario ${userId}`);
                    return subscription;
                  }
                }
              } else {
                // Si no, intentar obtenerlos
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                if (lineItems && lineItems.data.length > 0) {
                  const priceId = lineItems.data[0].price?.id;
                  if (priceId) {
                    const price = await stripe.prices.retrieve(priceId);
                    const productId = price.product as string;
                    
                    const plan = this.getPlanFromProductId(productId);
                    const limit = this.getLimitFromPlan(plan);
                    
                    // Actualizar la suscripción con la información disponible
                    subscription = await this.updateSubscription(userId, {
                      stripeCustomerId,
                      stripeSubscriptionId: session.subscription as string,
                      plan,
                      status: "active",
                      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 días por defecto
                      diagramsLimit: limit,
                      lastPaymentAttempt: new Date()
                    });
                    
                    console.log(`[SubscriptionService] Suscripción actualizada con datos de la sesión para usuario ${userId}`);
                    return subscription;
                  }
                }
              }
            } catch (error) {
              console.error("[SubscriptionService] Error obteniendo detalles del precio:", error);
            }
            
            // Si todo lo anterior falla, simplemente actualizamos el estado a "active"
            subscription = await this.updateSubscription(userId, {
              status: "active",
              lastPaymentAttempt: new Date()
            });
            
            console.log(`[SubscriptionService] Suscripción actualizada a estado active para evitar bloqueo: ${userId}`);
            return subscription;
          }

          // Procesar la información de la suscripción
          const plan = this.getPlanFromProductId(
            stripeSubscription.items.data[0].price.product as string
          );
          const limit = this.getLimitFromPlan(plan);

          // Actualizar la suscripción en nuestra base de datos
          subscription = await this.updateSubscription(userId, {
            stripeCustomerId,
            stripeSubscriptionId: stripeSubscription.id,
            plan,
            status: stripeSubscription.status as
              | "active"
              | "trialing"
              | "canceled"
              | "past_due"
              | "incomplete",
            currentPeriodEnd: new Date(
              stripeSubscription.current_period_end * 1000
            ),
            diagramsLimit: limit,
            lastPaymentAttempt: new Date()
          });

          console.log(`[SubscriptionService] Suscripción actualizada desde estado processing para usuario ${userId}`);
          return subscription;
        }

        // Estrategia para obtener la suscripción de Stripe
        let stripeSubscription: Stripe.Subscription | null = null;
        
        // 1. Intentar obtener la suscripción con el id de la suscripción de la sesión
        if (session.subscription) {
          try {
            stripeSubscription = await getStripeSubscriptionById(session.subscription as string);
            console.log("[SubscriptionService] Suscripción de Stripe encontrada por ID:", session.subscription);
          } catch (error) {
            console.log("[SubscriptionService] Error obteniendo suscripción por ID:", error);
          }
        }
        
        // 2. Si no se encuentra, intentar con el email del usuario
        if (!stripeSubscription && userEmail) {
          try {
            stripeSubscription = await getStripeSubscriptionByEmail(userEmail);
            console.log("[SubscriptionService] Suscripción de Stripe encontrada por email:", userEmail);
          } catch (error) {
            console.log("[SubscriptionService] Error obteniendo suscripción por email:", error);
          }
        }
        
        // 3. Si todavía no se encuentra, intentar con el ID del usuario
        if (!stripeSubscription) {
          try {
            stripeSubscription = await getStripeSubscriptionByIdUser(userId);
            console.log("[SubscriptionService] Suscripción de Stripe encontrada por userId:", userId);
          } catch (error) {
            console.log("[SubscriptionService] Error obteniendo suscripción por userId:", error);
          }
        }
        
        // Si no encontramos la suscripción de Stripe pero la sesión se completó,
        // intentamos obtener información del plan a partir de la sesión
        if (!stripeSubscription) {
          console.log("[SubscriptionService] No se pudo encontrar la suscripción de Stripe, usando datos de la sesión");
          
          try {
            // Intentar obtener el ID del producto o precio desde la sesión
            if (session.line_items) {
              console.log("[SubscriptionService] Usando line_items de la sesión");
              // Si la sesión ya tiene line_items
              if (session.line_items.data && session.line_items.data.length > 0) {
                const lineItem = session.line_items.data[0];
                if (lineItem.price && lineItem.price.product) {
                  const productId = typeof lineItem.price.product === 'string' 
                    ? lineItem.price.product 
                    : lineItem.price.product.id;
                  
                  const plan = this.getPlanFromProductId(productId);
                  const limit = this.getLimitFromPlan(plan);
                  
                  // Actualizar la suscripción con la información disponible
                  subscription = await this.updateSubscription(userId, {
                    stripeCustomerId,
                    stripeSubscriptionId: session.subscription as string,
                    plan,
                    status: "active",
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 días por defecto
                    diagramsLimit: limit,
                    lastPaymentAttempt: new Date()
                  });
                  
                  console.log(`[SubscriptionService] Suscripción actualizada con datos de la sesión para usuario ${userId}`);
                  return subscription;
                }
              }
            } else {
              // Si no, intentar obtenerlos
              const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
              if (lineItems && lineItems.data.length > 0) {
                const priceId = lineItems.data[0].price?.id;
                if (priceId) {
                  const price = await stripe.prices.retrieve(priceId);
                  const productId = price.product as string;
                  
                  const plan = this.getPlanFromProductId(productId);
                  const limit = this.getLimitFromPlan(plan);
                  
                  // Actualizar la suscripción con la información disponible
                  subscription = await this.updateSubscription(userId, {
                    stripeCustomerId,
                    stripeSubscriptionId: session.subscription as string,
                    plan,
                    status: "active",
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 días por defecto
                    diagramsLimit: limit,
                    lastPaymentAttempt: new Date()
                  });
                  
                  console.log(`[SubscriptionService] Suscripción actualizada con datos de la sesión para usuario ${userId}`);
                  return subscription;
                }
              }
            }
          } catch (error) {
            console.error("[SubscriptionService] Error obteniendo detalles del precio:", error);
          }
          
          console.error("[SubscriptionService] No se pudo encontrar la suscripción de Stripe ni obtener datos del plan");
          return null;
        }

        // Procesar la información de la suscripción
        const plan = this.getPlanFromProductId(
          stripeSubscription.items.data[0].price.product as string
        );
        const limit = this.getLimitFromPlan(plan);

        // Actualizar la suscripción en nuestra base de datos
        subscription = await this.updateSubscription(userId, {
          stripeCustomerId,
          stripeSubscriptionId: stripeSubscription.id,
          plan,
          status: stripeSubscription.status as
            | "active"
            | "trialing"
            | "canceled"
            | "past_due"
            | "incomplete",
          currentPeriodEnd: new Date(
            stripeSubscription.current_period_end * 1000
          ),
          diagramsLimit: limit,
          lastPaymentAttempt: new Date()
        });

        console.log(`[SubscriptionService] Suscripción actualizada para usuario ${userId}`);
        return subscription;
      }

      case "customer.subscription.updated": {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = stripeSubscription.customer as string;
        let subscriptionUserId = stripeSubscription.metadata?.userId;

        console.log(`[SubscriptionService] Actualización de suscripción para customer: ${stripeCustomerId}`);

        // Estrategia de búsqueda escalonada
        let existingSubscription = null;

        // 1. Intentar encontrar por stripeCustomerId (método original)
        try {
          existingSubscription = await getSubscriptionByStripeCustomerId(
            stripeCustomerId
          );
        } catch (error) {
          console.log(
            "[SubscriptionService] Error buscando suscripción por stripeCustomerId:",
            error
          );
        }

        // 2. Si no se encuentra y tenemos userId en los metadatos, buscar por userId
        if (!existingSubscription && subscriptionUserId) {
          try {
            existingSubscription = await getSubscriptionByUserId(
              subscriptionUserId
            );
            console.log("[SubscriptionService] Suscripción encontrada por userId de metadatos");
          } catch (error) {
            console.log("[SubscriptionService] Error buscando suscripción por userId:", error);
          }
        }

        // 3. Si aún no se encuentra, intentar obtener el cliente de Stripe para conseguir más información
        if (!existingSubscription) {
          try {
            // Obtener el cliente de Stripe para obtener más información
            const customer = await stripe.customers.retrieve(stripeCustomerId);

            if ("email" in customer && customer.email) {
              // Para este caso, como no tenemos función getUserByEmail, obtenemos todos los usuarios
              // y filtramos por email manualmente, o usamos alguna otra consulta que ya exista
              // Esta parte requiere ajustes según tu base de datos
              console.log("[SubscriptionService] Buscando usuario por email:", customer.email);

              // Alternativa: usar directamente el ID del cliente de Stripe para buscar la suscripción
              // esto asume que el campo stripeCustomerId existe en tu esquema de suscripción
              try {
                // Intentar una última búsqueda por customerId en la colección
                // Esta implementación depende de tu estructura de datos
                // aqui primero obtenemos el usuario en base al customer.email
                const user = await getUserByEmail(customer.email as string);
                console.log(
                  "[SubscriptionService] Buscando suscripción alternativa para cliente:",
                  stripeCustomerId
                );
                if (user) {
                  subscriptionUserId = user._id.toString();
                  //ahora obtenemos la suscripcion en base al userId
                  existingSubscription = await getSubscriptionByUserId(
                    subscriptionUserId as string
                  );
                }
              } catch (findError) {
                console.log("[SubscriptionService] Error en búsqueda alternativa:", findError);
              }
            }
          } catch (error) {
            console.log(
              "[SubscriptionService] Error al intentar métodos alternativos de búsqueda:",
              error
            );
          }
        }

        if (!existingSubscription) {
          console.error(
            "[SubscriptionService] No subscription found for customer:",
            stripeCustomerId
          );
          return null;
        }

        // Si no tenemos userId de los metadatos, usamos el de la suscripción existente
        if (!subscriptionUserId && existingSubscription.userId) {
          subscriptionUserId = existingSubscription.userId;
        }

        // Si después de todo no tenemos un userId, no podemos continuar
        if (!subscriptionUserId) {
          console.error("[SubscriptionService] No userId found for subscription update");
          return null;
        }

        // Verificar si la suscripción está en estado "processing"
        if (existingSubscription.status === "processing") {
          console.log(`[SubscriptionService] Suscripción en estado processing para usuario ${subscriptionUserId}, actualizando estado`);
        }

        const plan = this.getPlanFromProductId(
          stripeSubscription.items.data[0].price.product as string
        );
        const limit = this.getLimitFromPlan(plan);

        subscription = await this.updateSubscription(
          subscriptionUserId as string,
          {
            plan,
            status: stripeSubscription.status as
              | "active"
              | "trialing"
              | "canceled"
              | "past_due"
              | "incomplete",
            currentPeriodEnd: new Date(
              stripeSubscription.current_period_end * 1000
            ),
            diagramsLimit: limit,
            lastPaymentAttempt: new Date()
          }
        );

        console.log(`[SubscriptionService] Suscripción actualizada para usuario ${subscriptionUserId}, plan: ${plan}, status: ${stripeSubscription.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = stripeSubscription.customer as string;
        let subscriptionUserId = stripeSubscription.metadata?.userId;

        console.log(`[SubscriptionService] Eliminación de suscripción para customer: ${stripeCustomerId}`);

        // Estrategia de búsqueda escalonada
        let existingSubscription = null;
        
        // 1. Intentar encontrar por stripeCustomerId (método original)
        try {
          existingSubscription = await getSubscriptionByStripeCustomerId(stripeCustomerId);
        } catch (error) {
          console.log("[SubscriptionService] Error buscando suscripción por stripeCustomerId:", error);
        }
        
        // 2. Si no se encuentra y tenemos userId en los metadatos, buscar por userId
        if (!existingSubscription && subscriptionUserId) {
          try {
            existingSubscription = await getSubscriptionByUserId(subscriptionUserId);
            console.log("[SubscriptionService] Suscripción encontrada por userId de metadatos");
          } catch (error) {
            console.log("[SubscriptionService] Error buscando suscripción por userId:", error);
          }
        }
        
        // 3. Si aún no se encuentra, intentar obtener el cliente de Stripe para conseguir más información
        if (!existingSubscription) {
          try {
            // Obtener el cliente de Stripe para obtener más información
            const customer = await stripe.customers.retrieve(stripeCustomerId);
            
            if ('email' in customer && customer.email) {
              try {
                // Buscar usuario por email y luego su suscripción
                const user = await getUserByEmail(customer.email as string);
                if (user) {
                  subscriptionUserId = user._id.toString();
                  //ahora obtenemos la suscripcion en base al userId
                  existingSubscription = await getSubscriptionByUserId(subscriptionUserId);
                  console.log("[SubscriptionService] Suscripción encontrada por email del cliente Stripe");
                }
              } catch (findError) {
                console.log("[SubscriptionService] Error en búsqueda alternativa:", findError);
              }
            }
          } catch (error) {
            console.log("[SubscriptionService] Error al intentar métodos alternativos de búsqueda:", error);
          }
        }

        if (!existingSubscription) {
          console.error("[SubscriptionService] No subscription found for customer:", stripeCustomerId);
          return null;
        }

        // Si no tenemos userId de los metadatos, usamos el de la suscripción existente
        if (!subscriptionUserId && existingSubscription.userId) {
          subscriptionUserId = existingSubscription.userId;
        }

        // Si después de todo no tenemos un userId, no podemos continuar
        if (!subscriptionUserId) {
          console.error("[SubscriptionService] No userId found for subscription deletion");
          return null;
        }

        subscription = await this.updateSubscription(subscriptionUserId, {
          plan: "free",
          status: "canceled",
          stripeSubscriptionId: undefined,
          diagramsLimit: 3,
          lastPaymentAttempt: new Date()
        });

        console.log(`[SubscriptionService] Suscripción cancelada para usuario ${subscriptionUserId}`);
        break;
      }
    }

    return subscription;
  },

  /**
   * Obtiene el plan a partir del ID del producto en Stripe
   * @param productId ID del producto en Stripe
   * @returns El plan correspondiente
   */
  getPlanFromProductId(productId: string): "free" | "pro" | "team" {
    const productMap: Record<string, "free" | "pro" | "team"> = {
      [process.env.STRIPE_PRODUCT_FREE as string]: "free",
      [process.env.STRIPE_PRODUCT_PRO as string]: "pro",
      [process.env.STRIPE_PRODUCT_TEAM as string]: "team",
    };

    return productMap[productId] || "free";
  },

  /**
   * Obtiene el límite de diagramas a partir del plan
   * @param plan Plan de suscripción
   * @returns El límite de diagramas
   */
  getLimitFromPlan(plan: "free" | "pro" | "team"): number {
    const limitMap: Record<string, number> = {
      free: 3,
      pro: 50,
      team: 1000, // Prácticamente ilimitado
    };

    return limitMap[plan];
  },
};
