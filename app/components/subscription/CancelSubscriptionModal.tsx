'use client';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  currentPlan: string;
  currentPeriodEnd?: string;
}

export default function CancelSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  currentPlan,
  currentPeriodEnd
}: CancelSubscriptionModalProps) {
  if (!isOpen) return null;

  // Formatear el nombre del plan
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

  // Formatear la fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Cancelar suscripción</h3>
        
        <div className="mb-6">
          <p className="mb-4">
            ¿Estás seguro de que deseas cancelar tu suscripción al plan <span className="font-bold">{formatPlan(currentPlan)}</span>?
          </p>
          
          <div className="alert alert-warning mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              Tu suscripción seguirá activa hasta el <strong>{formatDate(currentPeriodEnd)}</strong>. Después de esa fecha, tu cuenta volverá al plan gratuito.
            </span>
          </div>
          
          <p className="text-sm text-base-content/70">
            Al cancelar, perderás acceso a las funcionalidades premium y tu límite de diagramas se reducirá. Los diagramas existentes seguirán siendo accesibles.
          </p>
        </div>
        
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Volver
          </button>
          
          <button 
            onClick={onConfirm}
            className="btn btn-error"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Cancelando...
              </>
            ) : (
              'Confirmar cancelación'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 