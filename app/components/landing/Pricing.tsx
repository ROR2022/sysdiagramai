'use client';

import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfecto para probar SysDiagramAI',
    features: [
      '3 diagramas por mes',
      'Diagramas de arquitectura básicos',
      'Esquemas de base de datos',
      'Explicaciones de componentes',
      'Exportación en Markdown',
    ],
    buttonText: 'Comenzar Gratis',
    buttonLink: '/auth/signin',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '9.99',
    description: 'Para profesionales que necesitan más poder',
    features: [
      '50 Diagramas por mes',
      'Diagramas de arquitectura avanzados',
      'Esquemas de base de datos detallados',
      'Explicaciones exhaustivas',
      'Exportación en múltiples formatos',
      'Historial completo',
      'Recomendaciones tecnológicas',
    ],
    buttonText: 'Suscribirse',
    buttonLink: '/auth/signin?plan=pro',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '29.99',
    description: 'Ideal para equipos y empresas',
    features: [
      '1000 Diagramas por mes',
      'Estadísticas de uso',
      'API personalizada',
      'Soporte dedicado',
      '+Todo lo del plan Pro',
    ],
    buttonText: 'Contactar Ventas',
    buttonLink: '#contact',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-8 md:py-16 bg-base-200 relative">
      {/* Elementos decorativos - Ocultos en móvil para mejor rendimiento */}
      <div className="absolute opacity-10 dark:opacity-20 top-0 left-0 right-0 overflow-hidden hidden md:block">
        <div className="container mx-auto px-4 md:px-8">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-primary fill-current">
            <path d="M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,165.3C672,192,768,224,864,213.3C960,203,1056,149,1152,117.3C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
      </div>
      
      <div className="container px-4 md:px-8 mx-auto relative z-10">
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-block bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2 md:mb-4 shadow-sm">
            Planes flexibles
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-base-content">Planes y Precios</h2>
          <p className="mt-2 md:mt-4 text-base md:text-lg text-base-content/80 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades.
          </p>
        </div>
        
        {/* Vista horizontal para móvil con scroll */}
        <div className="md:hidden overflow-x-auto pb-6 -mx-4 px-4">
          <div className="flex gap-4" style={{ minWidth: "max-content" }}>
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`card transition-all w-[280px] ${
                  plan.highlighted 
                    ? 'bg-primary text-primary-content border-2 border-primary shadow-lg shadow-primary/20 dark:shadow-primary/40' 
                    : 'bg-base-100 border border-base-300 shadow-md text-base-content'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <span className="badge badge-secondary py-2 px-3 text-xs font-medium shadow-md">Más Popular</span>
                  </div>
                )}
                <div className="card-body p-4">
                  <h3 className="card-title text-xl font-bold justify-center mb-0">{plan.name}</h3>
                  <div className="text-center my-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-xs ml-1 opacity-80">/mes</span>
                  </div>
                  <p className="text-center text-sm mb-3 opacity-90">{plan.description}</p>
                  <div className="divider my-1"></div>
                  <ul className="space-y-2 mb-4 text-sm">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0 ${
                            plan.highlighted 
                              ? 'text-secondary' 
                              : 'text-success dark:text-success/90'
                          }`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="opacity-90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="card-actions justify-center mt-auto">
                    <Link 
                      href={plan.buttonLink}
                      className={`btn btn-sm ${
                        plan.highlighted 
                          ? 'btn-secondary hover:btn-secondary/90' 
                          : 'btn-primary hover:btn-primary/90'
                      } w-full shadow-md`}
                    >
                      {plan.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Vista grid para tablet/desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`card transition-all hover:shadow-2xl hover:translate-y-[-5px] duration-300 ${
                plan.highlighted 
                  ? 'bg-primary text-primary-content border-4 border-primary shadow-lg shadow-primary/20 dark:shadow-primary/40' 
                  : 'bg-base-100 border border-base-300 shadow-xl text-base-content'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="badge badge-secondary py-3 px-4 font-medium shadow-md">Más Popular</span>
                </div>
              )}
              <div className="card-body p-6 md:p-8">
                <h3 className="card-title text-2xl font-bold justify-center">{plan.name}</h3>
                <div className="text-center my-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-sm ml-1 opacity-80">/mes</span>
                </div>
                <p className="text-center mb-6 opacity-90">{plan.description}</p>
                <div className="divider"></div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
                          plan.highlighted 
                            ? 'text-secondary' 
                            : 'text-success dark:text-success/90'
                        }`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="opacity-90">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="card-actions justify-center mt-auto">
                  <Link 
                    href={plan.buttonLink}
                    className={`btn ${
                      plan.highlighted 
                        ? 'btn-secondary hover:btn-secondary/90' 
                        : 'btn-primary hover:btn-primary/90'
                    } w-full shadow-md`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6 md:mt-12">
          <p className="text-base-content/70 mb-2 md:mb-4 text-sm md:text-base">¿Tienes dudas sobre qué plan elegir?</p>
          <Link href="/sales" className="btn btn-outline btn-xs md:btn-sm hover:bg-base-300/50">
            Contacta con nosotros
          </Link>
        </div>
      </div>
    </section>
  );
} 