"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero min-h-[80vh] md:min-h-[90vh] bg-base-200 relative overflow-hidden">
      {/* Círculos decorativos - Optimizados para móvil */}

      <div className="hidden md:flex justify-center items-center">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 dark:from-primary/10 dark:to-primary/5 blur-3xl">
        
        </div>
        
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-secondary/30 to-secondary/5 dark:from-secondary/10 dark:to-secondary/5 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-accent/20 dark:bg-accent/5 blur-3xl opacity-70 dark:opacity-30"></div>
      </div>
      <div className="hero-content flex-col lg:flex-row-reverse gap-4 md:gap-16 py-8 md:py-12 container mx-auto px-4 md:px-8 z-10">
        <div className="relative w-full max-w-sm md:max-w-xl lg:max-w-2xl">
          <button id="ror2022" className="btn btn-primary absolute hidden" style={{zIndex: 1000}}>ROR2022</button>
          {/* Tarjeta de ejemplo - Optimizada para móvil */}
          <div id="ror123" className="mockup-window border-2 border-base-300 shadow-xl shadow-base-300/20 bg-base-300 text-base-content dark:border-none dark:shadow-none scale-90 md:scale-100 transform origin-top">
          
            {/* Barra superior con elementos más pequeños en móvil */}
            <div className="flex justify-between items-center px-3 md:px-4 py-2 md:py-3 border-b border-base-300 bg-base-200">
              <div className="flex items-center">
                {/* Botones de ventana más pequeños en móvil */}
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-error ring-2 ring-error/30 drop-shadow-sm border border-error/50 mr-2 relative hover:brightness-110 active:brightness-90 transition-all">
                  <div className="absolute inset-0 bg-red-600/20 rounded-full shadow-inner"></div>
                </div>
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-warning ring-2 ring-warning/30 drop-shadow-sm border border-warning/50 mr-2 relative hover:brightness-110 active:brightness-90 transition-all">
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full shadow-inner"></div>
                </div>
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-success ring-2 ring-success/30 drop-shadow-sm border border-success/50 relative hover:brightness-110 active:brightness-90 transition-all">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full shadow-inner"></div>
                </div>
              </div>
              <div className="text-[10px] md:text-xs font-medium text-base-content/70">
                diagram-generator.ai
              </div>
            </div>
            {/* Contenido de la ventana simplificado para móvil */}
            <div className="bg-base-100 p-3 md:p-6 border-t-0 border border-base-300 dark:border-none">
              <div className="mockup-code text-xs md:text-sm mb-3 md:mb-4">
                <pre data-prefix="$" className="text-success">
                  <code>
                    Generar diagrama para tienda online
                  </code>
                </pre>
                <pre data-prefix=">" className="text-info">
                  <code>Completado en 2.3s</code>
                </pre>
              </div>
              <div className="p-2 md:p-4 bg-base-200 rounded-lg border border-base-300">
                <div className="text-[10px] md:text-xs text-base-content/70 mb-1 md:mb-2 font-medium">
                  Diagrama generado:
                </div>
                <pre className="text-[10px] md:text-xs overflow-auto whitespace-pre-wrap text-base-content font-mono leading-relaxed max-h-[100px] md:max-h-none">
                  {`graph TD
    Client[Cliente] --> LB[Load Balancer]
    LB --> API[API Gateway]
    API --> Auth[Autenticación]
    API --> Catalog[Catálogo]
    API --> Cart[Carrito]
    API --> Payment[Pagos]
    Catalog --> CatalogDB[(BD Catálogo)]
    Auth --> UserDB[(BD Usuarios)]`}
                </pre>
              </div>
            </div>
          </div>

          {/* Efecto de sombra adicional para tema claro */}
          <div className="absolute inset-0 rounded-lg border border-base-300 bg-gradient-to-r from-base-200/50 to-base-300/50 blur-md -z-10 dark:hidden"></div>

          {/* Etiqueta de éxito más pequeña en móvil */}
          <div className="badge badge-success text-success-content gap-1 items-center px-2 py-2 md:px-3 md:py-3 absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 shadow-md text-[10px] md:text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Generado en 2.3s
          </div>
        </div>

        <div className="max-w-lg md:max-w-xl">
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3 md:mb-4">
            Arquitectura inteligente
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-base-content leading-tight">
            Diseña sistemas escalables con la ayuda de{" "}
            <span className="text-primary">AI</span>
          </h1>
          <p className="py-4 md:py-6 text-base md:text-lg text-base-content/80">
            SysDiagramAI transforma tus requerimientos en diagramas de
            arquitectura y modelos de base de datos profesionales en segundos.
            Ahorra tiempo y mejora la comunicación de tus ideas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link href="/auth/signin" className="btn btn-primary btn-sm md:btn-md">
              Empezar Gratis
            </Link>
            <Link href="#features" className="btn btn-outline btn-sm md:btn-md">
              Ver Características
            </Link>
          </div>
          <div className="mt-4 md:mt-6 flex flex-wrap items-center text-xs md:text-sm text-base-content/70">
            <div className="flex items-center mr-4 mb-1">
              <span className="text-success mr-2">✓</span> 3 diagramas gratuitos
            </div>
            <div className="flex items-center">
              <span className="text-success mr-2">✓</span> Sin tarjeta de crédito
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
