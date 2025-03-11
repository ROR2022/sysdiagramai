"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero min-h-[90vh] bg-base-200 relative overflow-hidden">
      {/* Círculos decorativos - Mejorados para tema claro */}

<div className="flex justify-center items-center">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 dark:from-primary/10 dark:to-primary/5 blur-3xl">
        
      </div>
      
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-secondary/30 to-secondary/5 dark:from-secondary/10 dark:to-secondary/5 blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-accent/20 dark:bg-accent/5 blur-3xl opacity-70 dark:opacity-30"></div>
      </div>
      <div className="hero-content flex-col lg:flex-row-reverse gap-8 md:gap-16 py-12 container mx-auto px-4 md:px-8 z-10">
        <div className="relative w-full max-w-xl lg:max-w-2xl">
        <button id="ror2022" className="btn btn-primary absolute hidden" style={{zIndex: 1000}}>ROR2022</button>
          {/* Tarjeta de ejemplo - Diseño mejorado para ambos temas */}
          <div id="ror123" className="mockup-window border-2 border-base-300 shadow-xl shadow-base-300/20 bg-base-300 text-base-content dark:border-none dark:shadow-none">
          
            {/* Barra superior mejorada para tema claro */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-base-300 bg-base-200">
              <div className="flex items-center">
                {/* Botón rojo mejorado - Cerrar */}
                <div className="w-3 h-3 rounded-full bg-error ring-2 ring-error/30 drop-shadow-sm border border-error/50 mr-2 relative hover:brightness-110 active:brightness-90 transition-all">
                  <div className="absolute inset-0 bg-red-600/20 rounded-full shadow-inner"></div>
                </div>
                {/* Botón amarillo mejorado - Minimizar */}
                <div className="w-3 h-3 rounded-full bg-warning ring-2 ring-warning/30 drop-shadow-sm border border-warning/50 mr-2 relative hover:brightness-110 active:brightness-90 transition-all">
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full shadow-inner"></div>
                </div>
                {/* Botón verde mejorado - Maximizar */}
                <div className="w-3 h-3 rounded-full bg-success ring-2 ring-success/30 drop-shadow-sm border border-success/50 relative hover:brightness-110 active:brightness-90 transition-all">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full shadow-inner"></div>
                </div>
              </div>
              <div className="text-xs font-medium text-base-content/70">
                diagram-generator.ai
              </div>
            </div>
            {/* Contenido de la ventana con marco más definido en tema claro */}
            <div className="bg-base-100 p-4 md:p-6 border-t-0 border border-base-300 dark:border-none">
              <div className="mockup-code text-sm mb-4">
                <pre data-prefix="$" className="text-success">
                  <code>
                    Generar diagrama para tienda online con 1M usuarios
                  </code>
                </pre>
                <pre data-prefix=">" className="text-info">
                  <code>Generando diagrama...</code>
                </pre>
                <pre data-prefix=">" className="text-info">
                  <code>Completado en 2.3 segundos</code>
                </pre>
              </div>
              <div className="p-4 bg-base-200 rounded-lg border border-base-300">
                <div className="text-xs text-base-content/70 mb-2 font-medium">
                  Diagrama generado:
                </div>
                <pre className="text-xs overflow-auto whitespace-pre-wrap text-base-content font-mono leading-relaxed">
                  {`graph TD
    Client[Cliente Web] --> |HTTPS| LB[Load Balancer]
    LB --> API[API Gateway]
    API --> Auth[Servicio de Autenticación]
    API --> Catalog[Servicio de Catálogo]
    API --> Cart[Servicio de Carrito]
    API --> Payment[Servicio de Pagos]
    API --> Order[Servicio de Órdenes]
    Catalog --> CatalogDB[(Base de Datos de Catálogo)]
    Auth --> UserDB[(Base de Datos de Usuarios)]
    Cart --> CartDB[(Base de Datos de Carritos)]
    Payment --> |API| PaymentGateway[Pasarela de Pago]
    Order --> OrderDB[(Base de Datos de Órdenes)]`}
                </pre>
              </div>
            </div>
          </div>

          {/* Efecto de sombra adicional para tema claro */}
          <div className="absolute inset-0 rounded-lg border border-base-300 bg-gradient-to-r from-base-200/50 to-base-300/50 blur-md -z-10 dark:hidden"></div>

          {/* Etiqueta de éxito */}
          <div className="badge badge-success text-success-content gap-1 items-center px-3 py-3 absolute -bottom-3 -right-3 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
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
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            Arquitectura inteligente
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-base-content">
            Diseña sistemas escalables con la ayuda de{" "}
            <span className="text-primary">AI</span>
          </h1>
          <p className="py-6 text-lg text-base-content/80">
            SysDiagramAI transforma tus requerimientos en diagramas de
            arquitectura y modelos de base de datos profesionales en segundos.
            Ahorra tiempo y mejora la comunicación de tus ideas con diagramas
            generados por IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signin" className="btn btn-primary">
              Empezar Gratis
            </Link>
            <Link href="#features" className="btn btn-outline">
              Ver Características
            </Link>
          </div>
          <div className="mt-6 flex items-center text-sm text-base-content/70">
            <span className="text-success mr-2">✓</span> 3 diagramas gratuitos
            al mes
            <span className="mx-3">•</span>
            <span className="text-success mr-2">✓</span> Sin tarjeta de crédito
          </div>
        </div>
      </div>
    </div>
  );
}
