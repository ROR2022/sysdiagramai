'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CancelSubscriptionModal from './CancelSubscriptionModal';

interface Subscription {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodEnd?: string;
  diagramsUsed: number;
  diagramsLimit: number;
}

interface CurrentSubscriptionProps {
  subscription: Subscription;
  onCancel: () => Promise<void>;
  onBillingPortal: () => Promise<void>;
  canceling: boolean;
}

export default function CurrentSubscription({
  subscription,
  onCancel,
  onBillingPortal,
  canceling
}: CurrentSubscriptionProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Formatear el plan para mostrar
  const formatPlan = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'Gratuito';
      case 'pro':
        return 'Profesional';
      case 'team':
        return 'Equipo';
      default:
        return plan.charAt(0).toUpperCase() + plan.slice(1);
    }
  };

  // Formatear el estado para mostrar
  const formatStatus = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'trialing':
        return 'Periodo de prueba';
      case 'canceled':
        return 'Cancelada';
      case 'past_due':
        return 'Pago pendiente';
      case 'incomplete':
        return 'Incompleta';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Formatear la fecha de fin del periodo actual
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  // Calcular el porcentaje de uso de diagramas
  const usagePercentage = Math.min(
    Math.round((subscription.diagramsUsed / subscription.diagramsLimit) * 100),
    100
  );

  // Determinar el color del indicador de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'badge-success';
      case 'canceled':
        return 'badge-warning';
      case 'past_due':
      case 'incomplete':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  };

  // Determinar el color de la barra de progreso
  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-success';
    if (percentage < 90) return 'bg-warning';
    return 'bg-error';
  };

  // Manejar la cancelación de la suscripción
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  // Confirmar la cancelación
  const handleConfirmCancel = async () => {
    await onCancel();
    setShowCancelModal(false);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setShowCancelModal(false);
  };

  return (
    <>
      <div className="bg-base-200 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tu suscripción actual</h2>
          <span className={`badge ${getStatusColor(subscription.status)}`}>
            {formatStatus(subscription.status)}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="text-sm text-base-content/70 mb-1">Plan</div>
              <div className="text-lg font-semibold">
                <span className="badge badge-primary badge-lg">{formatPlan(subscription.plan)}</span>
              </div>
            </div>
            
            {subscription.currentPeriodEnd && (
              <div className="mb-4">
                <div className="text-sm text-base-content/70 mb-1">Renovación</div>
                <div className="text-lg">{formatDate(subscription.currentPeriodEnd)}</div>
                {subscription.status === 'canceled' && (
                  <div className="text-sm text-warning mt-1">
                    Tu suscripción finalizará en esta fecha
                  </div>
                )}
              </div>
            )}
            
            {subscription.stripeCustomerId && (
              <div className="mb-4">
                <div className="text-sm text-base-content/70 mb-1">ID de cliente</div>
                <div className="text-sm font-mono bg-base-300 p-1 rounded">
                  {subscription.stripeCustomerId.substring(0, 8)}...
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="mb-2">
              <div className="text-sm text-base-content/70 mb-1">Uso de diagramas</div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">
                  {subscription.diagramsUsed} / {subscription.diagramsLimit}
                </span>
                <span className="text-sm">
                  {usagePercentage}%
                </span>
              </div>
            </div>
            
            <div className="w-full bg-base-300 rounded-full h-2.5 mb-6">
              <div
                className={`h-2.5 rounded-full ${getProgressColor(usagePercentage)}`}
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            
            {usagePercentage >= 80 && (
              <div className="alert alert-warning mb-4 py-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Estás cerca de tu límite de diagramas. Considera actualizar tu plan.</span>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              {subscription.plan !== 'free' && (
                <>
                  <button
                    onClick={onBillingPortal}
                    className="btn btn-outline btn-primary btn-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Portal de facturación
                  </button>
                  
                  <button
                    onClick={handleCancelClick}
                    disabled={canceling || subscription.status === 'canceled'}
                    className="btn btn-outline btn-error btn-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Cancelar suscripción
                  </button>
                </>
              )}
              
              {subscription.plan === 'free' && (
                <div className="alert alert-info py-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Actualiza a un plan de pago para acceder a más funcionalidades.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        isLoading={canceling}
        currentPlan={subscription.plan}
        currentPeriodEnd={subscription.currentPeriodEnd}
      />
    </>
  );
} 