'use client';

const features = [
  {
    title: 'Diagramas de Arquitectura',
    description: 'Genera diagramas de arquitectura detallados basados en tus requerimientos. Visualiza componentes, flujos de datos y dependencias.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    title: 'Esquemas de Base de Datos',
    description: 'Diseña modelos de datos con relaciones entre entidades y atributos claramente definidos para respaldar tus sistemas.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    title: 'Explicaciones Detalladas',
    description: 'Recibe documentación completa con cada diagrama, explicando los componentes, decisiones de diseño y mejores prácticas.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    title: 'Recomendaciones Tecnológicas',
    description: 'Obtén sugerencias de herramientas y tecnologías adecuadas para implementar tu sistema, con justificaciones.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    title: 'Formato Exportable',
    description: 'Descarga tus diagramas en diferentes formatos como PNG, SVG o Markdown para incluirlos en tu documentación.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    title: 'Historial de Diseños',
    description: 'Guarda y accede a todos tus diagramas anteriores para reutilizarlos o modificarlos según evolucionen tus proyectos.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="py-8 md:py-16 bg-base-100 relative">
      {/* Elementos decorativos - Ocultos en móvil para mejor rendimiento */}
      <div className="absolute top-0 left-0 w-full overflow-hidden hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="opacity-10 text-base-300 fill-current">
          <path d="M1200 120L0 16.48V0h1200v120z"></path>
        </svg>
      </div>
      
      <div className="container px-4 md:px-8 mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2 md:mb-4">
            Características completas
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-base-content">Características Principales</h2>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-base-content/80 max-w-2xl mx-auto">
            SysDiagramAI simplifica el diseño de sistemas con herramientas potentes y una interfaz intuitiva.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-200 shadow-md hover:shadow-lg transition-all hover:translate-y-[-5px] duration-300">
              <div className="card-body p-4 md:p-6">
                <div className="flex items-center mb-2 md:mb-4">
                  <div className="p-2 md:p-3 bg-primary/10 rounded-lg text-primary mr-2 md:mr-3">
                    <div className="w-5 h-5 md:w-6 md:h-6">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="card-title text-lg md:text-xl text-base-content">{feature.title}</h3>
                </div>
                <p className="text-sm md:text-base text-base-content/80">{feature.description}</p>
                <div className="card-actions mt-3 md:mt-4">
                  <button className="btn btn-ghost btn-xs md:btn-sm px-0 flex items-center text-primary">
                    <span className="mr-1">Saber más</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 