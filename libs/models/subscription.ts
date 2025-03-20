import mongoose, { Schema } from "mongoose";

// Interface para la suscripción
export interface ISubscription {
  _id?: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete' | 'processing';
  currentPeriodEnd?: Date;
  diagramsUsed: number;
  diagramsLimit: number;
  created?: Date;
  updated?: Date;
  lastPaymentAttempt?: Date; // Nueva propiedad para rastrear intentos de pago
}

// Schema de Mongoose
const SubscriptionSchema = new Schema<ISubscription>({
  userId: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  stripeCustomerId: { 
    type: String, 
    required: true,
    unique: true
  },
  stripeSubscriptionId: { 
    type: String,
    sparse: true
  },
  plan: { 
    type: String, 
    enum: ['free', 'pro', 'team'],
    default: 'free'
  },
  status: { 
    type: String, 
    enum: ['active', 'trialing', 'canceled', 'past_due', 'incomplete', 'processing'],
    default: 'active'
  },
  currentPeriodEnd: { 
    type: Date
  },
  diagramsUsed: { 
    type: Number,
    default: 0
  },
  diagramsLimit: { 
    type: Number,
    default: 5
  },
  created: { 
    type: Date, 
    default: Date.now 
  },
  updated: { 
    type: Date, 
    default: Date.now 
  },
  lastPaymentAttempt: {
    type: Date
  }
}, {
  timestamps: { 
    createdAt: 'created', 
    updatedAt: 'updated' 
  }
});

// Método para verificar si un usuario puede crear más diagramas
SubscriptionSchema.methods.canCreateDiagram = function() {
  // Si no es plan gratuito, siempre puede crear
  if (this.plan !== 'free') return true;
  
  // Si es plan gratuito, verificar el límite
  return this.diagramsUsed < this.diagramsLimit;
};

// Método para incrementar el contador de diagramas usados
SubscriptionSchema.methods.incrementDiagramsUsed = function() {
  this.diagramsUsed += 1;
  return this.save();
};

// Método para resetear el contador de diagramas (por ejemplo, al inicio de mes)
SubscriptionSchema.methods.resetDiagramsUsed = function() {
  this.diagramsUsed = 0;
  return this.save();
};

// Creamos el modelo si no existe (evita errores en hot reload)
export const Subscription = mongoose.models.Subscription || 
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);