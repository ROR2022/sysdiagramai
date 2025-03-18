'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SupportPage() {
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
          <h1>Centro de Soporte</h1>
          <p className="text-sm text-base-content/70">Estamos aquí para ayudarte a resolver cualquier duda o problema</p>
          
          <section>
            <h2>1. Preguntas Frecuentes (FAQ)</h2>
            <div className="space-y-4">
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  ¿Qué es SysDiagramAI y cómo funciona?
                </div>
                <div className="collapse-content">
                  <p>SysDiagramAI es una plataforma basada en inteligencia artificial que te permite crear diagramas de sistemas de forma sencilla utilizando lenguaje natural. Simplemente describe lo que necesitas y nuestro sistema generará automáticamente diagramas profesionales.</p>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  ¿Cómo puedo crear mi primer diagrama?
                </div>
                <div className="collapse-content">
                  <p>Para crear tu primer diagrama:</p>
                  <ol>
                    <li>Inicia sesión en tu cuenta</li>
                    <li>Haz clic en &quot;Nuevo Diagrama&quot;</li>
                    <li>Describe el sistema que deseas visualizar</li>
                    <li>Revisa y personaliza el diagrama generado</li>
                    <li>Guarda o exporta tu diagrama</li>
                  </ol>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  ¿Qué formatos de exportación están disponibles?
                </div>
                <div className="collapse-content">
                  <p>SysDiagramAI te permite exportar tus diagramas en múltiples formatos, incluyendo:</p>
                  <ul>
                    <li>PNG (alta resolución)</li>
                    <li>SVG (vectorial)</li>
                    <li>PDF</li>
                    <li>JSON (para edición posterior)</li>
                  </ul>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  ¿Puedo colaborar con mi equipo en un mismo diagrama?
                </div>
                <div className="collapse-content">
                  <p>Sí, nuestros planes Team y Enterprise permiten la colaboración en tiempo real. Múltiples usuarios pueden trabajar simultáneamente en el mismo diagrama, ver cambios en tiempo real y comentar en secciones específicas.</p>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h2>2. Guías Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
              <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h3 className="card-title">Primeros Pasos</h3>
                  <p>Aprende lo básico para comenzar a usar SysDiagramAI efectivamente.</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">Ver Guía</button>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h3 className="card-title">Comandos Avanzados</h3>
                  <p>Descubre comandos y técnicas para crear diagramas más sofisticados.</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">Ver Guía</button>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h3 className="card-title">Personalización</h3>
                  <p>Aprende a personalizar el estilo y apariencia de tus diagramas.</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">Ver Guía</button>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h3 className="card-title">Integración con Otras Herramientas</h3>
                  <p>Conecta SysDiagramAI con tu stack tecnológico existente.</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">Ver Guía</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h2>3. Resolución de Problemas</h2>
            <p>Aquí encontrarás soluciones a problemas comunes que podrías encontrar al usar nuestra plataforma:</p>
            
            <div className="space-y-4 my-4">
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  El diagrama no se genera correctamente
                </div>
                <div className="collapse-content">
                  <p>Si tu diagrama no se genera como esperabas:</p>
                  <ul>
                    <li>Intenta ser más específico en tu descripción</li>
                    <li>Utiliza términos técnicos precisos para mejor reconocimiento</li>
                    <li>Divide sistemas complejos en componentes más pequeños</li>
                    <li>Revisa los ejemplos en nuestra documentación para ver descripciones efectivas</li>
                  </ul>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  Problemas de rendimiento o carga lenta
                </div>
                <div className="collapse-content">
                  <p>Si experimentas lentitud:</p>
                  <ul>
                    <li>Verifica tu conexión a internet</li>
                    <li>Cierra pestañas o aplicaciones innecesarias</li>
                    <li>Limpia la caché del navegador</li>
                    <li>Para diagramas muy grandes, considera dividirlos en secciones</li>
                  </ul>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  Errores al exportar diagramas
                </div>
                <div className="collapse-content">
                  <p>Si tienes problemas al exportar:</p>
                  <ul>
                    <li>Asegúrate de que el diagrama esté completamente cargado antes de exportar</li>
                    <li>Verifica que tienes suficiente espacio de almacenamiento</li>
                    <li>Prueba con un formato de exportación diferente</li>
                    <li>Si el problema persiste, guarda tu trabajo y recarga la página</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h2>4. Contacto de Soporte</h2>
            <p>Si no encuentras respuesta a tu pregunta, nuestro equipo de soporte está listo para ayudarte:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h3 className="card-title">Correo Electrónico</h3>
                  <p>Tiempo de respuesta: 24-48 horas</p>
                  <p className="font-medium">kodeandoando2023@gmail.com</p>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h3 className="card-title">Chat en Vivo</h3>
                  <p>Disponible en horario laboral</p>
                  <div className="card-actions justify-start mt-2">
                    <button className="btn btn-primary">Iniciar Chat</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="alert alert-info shadow-lg mt-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                  <span className="font-bold">Clientes Premium y Enterprise</span>
                  <p>Cuentan con soporte prioritario y acceso a un gerente de cuentas dedicado.</p>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h2>5. Recursos Adicionales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
              <Link href="#" className="card bg-base-200 hover:bg-base-300 transition-colors shadow-md">
                <div className="card-body items-center text-center p-4">
                  <h3 className="card-title">Documentación</h3>
                  <p>Guías detalladas y referencias técnicas</p>
                </div>
              </Link>
              
              <Link href="#" className="card bg-base-200 hover:bg-base-300 transition-colors shadow-md">
                <div className="card-body items-center text-center p-4">
                  <h3 className="card-title">Tutoriales en Video</h3>
                  <p>Aprende visualmente con nuestras guías paso a paso</p>
                </div>
              </Link>
              
              <Link href="#" className="card bg-base-200 hover:bg-base-300 transition-colors shadow-md">
                <div className="card-body items-center text-center p-4">
                  <h3 className="card-title">Comunidad</h3>
                  <p>Conecta con otros usuarios y comparte conocimientos</p>
                </div>
              </Link>
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
