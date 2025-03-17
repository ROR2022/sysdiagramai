'use client';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  intervalCount: number;
  features: string[];
  highlighted: boolean;
}

interface SubscriptionPlansProps {
  plans: Plan[];
  currentPlan?: string;
  onSubscribe: (priceId: string) => Promise<void>;
  subscribing: boolean;
}

export default function SubscriptionPlans({
  plans,
  currentPlan,
  onSubscribe,
  subscribing
}: SubscriptionPlansProps) {

  console.log('subscription plans:..', plans);
  // Formatear el precio para mostrar
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  // Formatear el intervalo para mostrar
  const formatInterval = (interval: string, count: number) => {
    switch (interval) {
      case 'month':
        return count === 1 ? 'mes' : `${count} meses`;
      case 'year':
        return count === 1 ? 'año' : `${count} años`;
      case 'week':
        return count === 1 ? 'semana' : `${count} semanas`;
      case 'day':
        return count === 1 ? 'día' : `${count} días`;
      default:
        return `${count} ${interval}`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`card bg-base-100 shadow-xl overflow-hidden ${
            plan.highlighted ? 'border-2 border-primary' : ''
          }`}
        >
          {plan.highlighted && (
            <div className="bg-primary text-primary-content py-1 px-4 text-center text-sm font-semibold">
              Recomendado
            </div>
          )}
          
          <div className="card-body">
            <h3 className="card-title text-xl flex justify-center">{plan.name.toUpperCase()}</h3>
            
            <p className="text-secondary mb-4 flex justify-center">{plan.description}</p>
            
            <div className="flex justify-center items-baseline mb-6">
              <span className="text-3xl font-bold">
                {formatPrice(plan.price, plan.currency)}
              </span>
              <span className="text-base-content/70 ml-2">
                / {formatInterval(plan.interval, plan.intervalCount)}
              </span>
            </div>
            
            <div className="divider text-sm text-base-content/50">Características</div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-success mr-2 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="card-actions justify-center mt-auto">
              {currentPlan === plan.name.toLowerCase() && plan.name.toLowerCase() !== 'free' ? (
                <div className="badge badge-success badge-lg p-3 mb-2">Plan actual</div>
              ) : null}
              
              <button
                onClick={() => onSubscribe(plan.id)}
                disabled={
                  subscribing ||
                  (currentPlan === plan.name.toLowerCase() &&
                    plan.name.toLowerCase() !== 'free')
                }
                className={`btn ${
                  plan.highlighted ? 'btn-primary' : 'btn-outline btn-primary'
                } w-full ${plan.highlighted ? 'btn-lg' : ''}`}
              >
                {subscribing ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Procesando...
                  </>
                ) : currentPlan === plan.name.toLowerCase() &&
                  plan.name.toLowerCase() !== 'free' ? (
                  'Plan actual'
                ) : (
                  <>
                    Suscribirse
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 