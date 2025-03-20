'use client';

import { useEffect, useState } from 'react';
import CancelSubscriptionModal from './CancelSubscriptionModal';

interface Subscription {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete' | 'processing';
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
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [showLastUpdate, setShowLastUpdate] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  
  // Estado del plan
  const isPlanActive = subscription.status === 'active' || subscription.status === 'trialing';
  const isPlanCanceled = subscription.status === 'canceled';
  const hasPaidPlan = subscription.plan !== 'free';
  
  // Formato para plan y fecha
  const formatPlanName = (plan: string) => {
    switch (plan) {
      case 'free': return 'Free';
      case 'pro': return 'Pro';
      case 'team': return 'Team';
      default: return plan.charAt(0).toUpperCase() + plan.slice(1);
    }
  };
  
  // Función para calcular tiempo restante
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!subscription.currentPeriodEnd) {
        setTimeLeft("");
        return;
      }
      
      const periodEnd = new Date(subscription.currentPeriodEnd);
      const now = new Date();
      const diffTime = periodEnd.getTime() - now.getTime();
      
      if (diffTime <= 0) {
        setTimeLeft("Finalizado");
        return;
      }
      
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (diffDays > 30) {
        const diffMonths = Math.floor(diffDays / 30);
        setTimeLeft(`${diffMonths} mes${diffMonths !== 1 ? 'es' : ''}`);
      } else if (diffDays > 0) {
        setTimeLeft(`${diffDays} día${diffDays !== 1 ? 's' : ''}`);
      } else {
        setTimeLeft(`${diffHours} hora${diffHours !== 1 ? 's' : ''}`);
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Actualizar cada minuto
    
    return () => clearInterval(timer);
  }, [subscription.currentPeriodEnd]);
  
  // Efecto para mostrar temporalmente la hora de última actualización
  useEffect(() => {
    setLastChecked(new Date());
    setShowLastUpdate(true);
    
    const timer = setTimeout(() => {
      setShowLastUpdate(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [subscription]);

  // Obtener el porcentaje de uso
  const usagePercentage = Math.min(
    Math.round((subscription.diagramsUsed / subscription.diagramsLimit) * 100),
    100
  );
  
  // Determinar el color de la barra de progreso
  const getProgressColor = () => {
    if (usagePercentage >= 90) return "bg-error";
    if (usagePercentage >= 70) return "bg-warning";
    return "bg-success";
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
      <div className="bg-base-200 p-6 rounded-box shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold">Tu suscripción actual</h2>
            <p className="text-base-content/70 text-sm">
              Detalles de tu plan y uso
              {showLastUpdate && (
                <span className="ml-2 text-xs opacity-60">
                  (Actualizado: {lastChecked.toLocaleTimeString()})
                </span>
              )}
            </p>
          </div>
          
          {/* Estado de la suscripción */}
          <div className="flex items-center gap-2">
            {subscription.status === 'active' && (
              <span className="badge badge-success gap-1">
                <span className="h-2 w-2 rounded-full bg-success-content"></span>
                Activo
              </span>
            )}
            {subscription.status === 'trialing' && (
              <span className="badge badge-info gap-1">
                <span className="h-2 w-2 rounded-full bg-info-content"></span>
                Periodo de prueba
              </span>
            )}
            {subscription.status === 'canceled' && (
              <span className="badge badge-warning gap-1">
                <span className="h-2 w-2 rounded-full bg-warning-content"></span>
                Cancelado
              </span>
            )}
            {(subscription.status === 'past_due' || subscription.status === 'incomplete') && (
              <span className="badge badge-error gap-1">
                <span className="h-2 w-2 rounded-full bg-error-content"></span>
                Pago pendiente
              </span>
            )}
            {subscription.status === 'processing' && (
              <span className="badge badge-info gap-1">
                <span className="h-2 w-2 rounded-full bg-info-content"></span>
                Procesando
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">
                <span className="text-lg">Plan {formatPlanName(subscription.plan)}</span>
                {isPlanActive && hasPaidPlan && (
                  <span className="text-xs badge badge-primary">Premium</span>
                )}
              </h3>
              
              <div className="divider my-2"></div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Diagramas usados</span>
                    <span className="font-medium">
                      {subscription.diagramsUsed} / {subscription.diagramsLimit}
                    </span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor()}`} 
                      style={{ width: `${usagePercentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-right text-base-content/70">
                    {subscription.diagramsLimit - subscription.diagramsUsed} diagramas disponibles
                  </div>
                </div>
                
                {hasPaidPlan && subscription.currentPeriodEnd && (
                  <div>
                    <div className="text-sm font-medium">Periodo actual</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm">
                        {isPlanCanceled ? "Tu plan finaliza en:" : "Próxima facturación:"}
                      </span>
                      <span className="text-sm font-semibold">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        {timeLeft && ` (${timeLeft})`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Alerta si se acercan al límite */}
              {usagePercentage >= 80 && (
                <div className="alert alert-warning mt-4 py-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    {usagePercentage >= 90 
                      ? "¡Has alcanzado casi el límite de tu plan!"
                      : "Te estás acercando al límite de diagramas de tu plan."}
                  </div>
                </div>
              )}
              
              {/* Alerta si el plan está cancelado */}
              {isPlanCanceled && hasPaidPlan && (
                <div className="alert alert-warning mt-4 py-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    Tu suscripción ha sido cancelada pero seguirá activa hasta el final del periodo actual.
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg">Gestión de Suscripción</h3>
              
              <div className="divider my-2"></div>
              
              <div className="space-y-3">
                {/* Características del plan */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Tu plan incluye:</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Hasta {subscription.diagramsLimit} diagramas
                    </li>
                    {hasPaidPlan && (
                      <>
                        <li className="flex items-center text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Generación avanzada de diagramas
                        </li>
                        <li className="flex items-center text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Soporte prioritario
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="flex flex-col gap-2 pt-4">
                  {hasPaidPlan && (
                    <>
                      <button
                        onClick={onBillingPortal}
                        className="btn btn-outline btn-sm w-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Administrar facturación
                      </button>
                      
                      {!isPlanCanceled && (
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="btn btn-sm btn-error btn-outline w-full"
                          disabled={canceling}
                        >
                          {canceling ? (
                            <>
                              <span className="loading loading-spinner loading-xs"></span>
                              Cancelando...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Cancelar suscripción
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Texto informativo */}
                  <div className="text-xs text-base-content/60 mt-2">
                    {hasPaidPlan ? (
                      isPlanCanceled ? (
                        "Tu suscripción ya ha sido cancelada. Puedes volver a suscribirte en cualquier momento."
                      ) : (
                        "La cancelación será efectiva al final del periodo de facturación actual."
                      )
                    ) : (
                      "Actualiza a un plan premium para acceder a más características."
                    )}
                  </div>
                </div>
              </div>
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