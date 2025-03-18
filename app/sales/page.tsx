'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SalesPage() {
  const router = useRouter();
  
  return (
    <div className="text-base-content bg-base-100 min-h-screen">
      {/* Barra de navegación superior simple */}
      <header className="bg-base-200 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <span>SysDiagramAI</span>
          </Link>
          <button 
            onClick={() => router.push("/")} 
            className="btn btn-ghost btn-sm"
          >
            Volver
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="prose prose-sm md:prose-base lg:prose-lg mx-auto">
          <h1>Ventas Empresariales</h1>
          <p className="text-sm text-base-content/70">Soluciones adaptadas para equipos y organizaciones de todos los tamaños</p>
          
          <section className="my-8">
            <h2>1. Planes Empresariales</h2>
            <p>En SysDiagramAI entendemos que las necesidades de cada organización son únicas. Nuestros planes empresariales están diseñados para ofrecer escalabilidad, seguridad y soporte adaptados a tu organización.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title">Team</h3>
                  <p className="font-semibold text-lg">Desde $199/mes</p>
                  <p className="mb-4">Para equipos pequeños y medianos</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Hasta 25 usuarios
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Colaboración en tiempo real
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Diagramas ilimitados
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Soporte prioritario
                    </li>
                  </ul>
                  <div className="card-actions justify-center mt-4">
                    <button className="btn btn-primary">Contactar Ventas</button>
                  </div>
                </div>
              </div>
              
              <div className="card bg-primary text-primary-content shadow-lg">
                <div className="card-body">
                  <div className="absolute -top-3 right-4 bg-secondary text-secondary-content px-3 py-1 rounded-full text-xs font-bold">Popular</div>
                  <h3 className="card-title">Business</h3>
                  <p className="font-semibold text-lg">Desde $499/mes</p>
                  <p className="mb-4">Para organizaciones en crecimiento</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Hasta 100 usuarios
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      SSO y controles de administrador
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Análisis y reportes avanzados
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      API para integraciones
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Gerente de cuenta dedicado
                    </li>
                  </ul>
                  <div className="card-actions justify-center mt-4">
                    <button className="btn bg-primary-content text-primary">Contactar Ventas</button>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title">Enterprise</h3>
                  <p className="font-semibold text-lg">Personalizado</p>
                  <p className="mb-4">Para grandes organizaciones</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Usuarios ilimitados
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Despliegue en la nube o local
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Personalización completa
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      SLA garantizado
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Auditoría y cumplimiento
                    </li>
                  </ul>
                  <div className="card-actions justify-center mt-4">
                    <button className="btn btn-primary">Contactar Ventas</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="my-8">
            <h2>2. Soluciones Personalizadas</h2>
            <p>Entendemos que cada organización tiene requisitos únicos. Nuestro equipo de expertos puede crear soluciones adaptadas específicamente a tus necesidades.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title">Integración con Sistemas Existentes</h3>
                  <p>Conectamos SysDiagramAI con tu infraestructura actual:</p>
                  <ul className="list-disc list-inside mb-4">
                    <li>Sistemas de gestión de proyectos</li>
                    <li>Herramientas de colaboración</li>
                    <li>Repositorios de código</li>
                    <li>Plataformas DevOps</li>
                  </ul>
                </div>
              </div>
              
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title">Personalización de Marca</h3>
                  <p>Adapta SysDiagramAI a la identidad de tu organización:</p>
                  <ul className="list-disc list-inside mb-4">
                    <li>Logotipos y colores personalizados</li>
                    <li>Dominios propios</li>
                    <li>Plantillas corporativas</li>
                    <li>Terminología específica de la industria</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <section className="my-8">
            <h2>3. Proceso de Compra</h2>
            <p>Hemos simplificado el proceso de adquisición para asegurar una transición sin problemas a SysDiagramAI.</p>
            
            <div className="steps steps-vertical lg:steps-horizontal w-full my-6">
              <div className="step step-primary">
                <div className="mt-2">
                  <p className="font-bold">Consulta</p>
                  <p className="text-sm">Evaluación de necesidades y requisitos</p>
                </div>
              </div>
              <div className="step step-primary">
                <div className="mt-2">
                  <p className="font-bold">Demostración</p>
                  <p className="text-sm">Presentación personalizada de la plataforma</p>
                </div>
              </div>
              <div className="step step-primary">
                <div className="mt-2">
                  <p className="font-bold">Propuesta</p>
                  <p className="text-sm">Plan adaptado a tu organización</p>
                </div>
              </div>
              <div className="step">
                <div className="mt-2">
                  <p className="font-bold">Implementación</p>
                  <p className="text-sm">Configuración y capacitación del equipo</p>
                </div>
              </div>
            </div>
            
            <div className="alert alert-info shadow-lg">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                  <p className="font-semibold">Prueba Gratuita para Empresas</p>
                  <p>Ofrecemos un período de prueba extendido para equipos empresariales. Contacta con nuestro equipo de ventas para más detalles.</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="my-8">
            <h2>4. Programa de Partners</h2>
            <p>Únete a nuestro programa de partners y genera ingresos adicionales mientras ofreces a tus clientes una solución innovadora de diagramación de sistemas.</p>
            
            <div className="card bg-base-200 shadow-lg my-6">
              <div className="card-body">
                <h3 className="card-title">Beneficios del Programa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p>Comisiones competitivas</p>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p>Soporte de marketing</p>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p>Capacitación técnica</p>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-success" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p>Portal de partners</p>
                  </div>
                </div>
                <div className="card-actions justify-center mt-6">
                  <button className="btn btn-outline btn-primary">Solicitar Información</button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="my-8">
            <h2>5. Preguntas Frecuentes sobre Ventas</h2>
            <div className="space-y-4 my-6">
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  ¿Cuál es la diferencia entre los planes Team y Business?
                </div>
                <div className="collapse-content">
                  <p>El plan Team está diseñado para equipos más pequeños con necesidades básicas de colaboración. El plan Business incluye características avanzadas como SSO, controles de administrador más detallados, análisis avanzados e integraciones API para organizaciones con requisitos más complejos.</p>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  ¿Ofrecen facturación anual con descuento?
                </div>
                <div className="collapse-content">
                  <p>Sí, ofrecemos un descuento del 20% para los clientes que eligen la facturación anual en lugar de mensual para todos nuestros planes. Esta opción se discutirá durante tu consulta con nuestro equipo de ventas.</p>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  ¿Qué métodos de pago aceptan?
                </div>
                <div className="collapse-content">
                  <p>Aceptamos tarjetas de crédito (Visa, Mastercard, American Express), transferencias bancarias y, para clientes empresariales, ofrecemos la opción de pago contra factura con términos de pago neto a 30 días.</p>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  ¿Puedo cambiar de plan después de la compra?
                </div>
                <div className="collapse-content">
                  <p>Sí, puedes actualizar tu plan en cualquier momento. Si decides cambiar a un plan inferior, el cambio se aplicará al final de tu período de facturación actual. Para cambios de plan, ponte en contacto con nuestro equipo de soporte.</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="my-8">
            <h2>6. Contacto Directo</h2>
            <p>Nuestro equipo de ventas está listo para atender todas tus consultas y ayudarte a encontrar la solución perfecta para tu organización.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h3 className="card-title">Correo Electrónico</h3>
                  <p className="font-medium">kodeandoando2023@gmail.com</p>
                  <p className="text-sm">Tiempo de respuesta: 24 horas</p>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h3 className="card-title">Programar una Demo</h3>
                  <p>Agenda una demostración personalizada con nuestro equipo de ventas</p>
                  <div className="card-actions justify-start mt-2">
                    <button className="btn btn-primary">Programar Ahora</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-md mt-6">
              <div className="card-body">
                <h3 className="card-title">Formulario de Contacto</h3>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Nombre</span>
                  </label>
                  <input type="text" placeholder="Tu nombre" className="input input-bordered w-full" />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Correo Electrónico</span>
                  </label>
                  <input type="email" placeholder="tu@email.com" className="input input-bordered w-full" />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Empresa</span>
                  </label>
                  <input type="text" placeholder="Nombre de tu empresa" className="input input-bordered w-full" />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Mensaje</span>
                  </label>
                  <textarea className="textarea textarea-bordered h-24" placeholder="Cuéntanos sobre tu empresa y necesidades"></textarea>
                </div>
                
                <div className="form-control mt-4">
                  <button className="btn btn-primary">Enviar Consulta</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-base-300 text-base-content py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">{new Date().getFullYear()} SysDiagramAI. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/legal/privacy" className="text-sm link link-hover">Política de Privacidad</Link>
            <Link href="/legal/terms" className="text-sm link link-hover">Términos y Condiciones</Link>
            <Link href="/legal/cookies" className="text-sm link link-hover">Política de Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
