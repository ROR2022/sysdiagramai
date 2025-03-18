'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
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
          <h1>Política de Privacidad</h1>
          <p className="text-sm text-base-content/70">Última actualización: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2>1. Introducción</h2>
            <p>En SysDiagramAI (&quot;nosotros&quot;, &quot;nuestro&quot;, o &quot;la Plataforma&quot;), valoramos su privacidad y nos comprometemos a proteger sus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos y compartimos su información cuando utiliza nuestra plataforma.</p>
            <p>Por favor, lea esta política cuidadosamente para entender nuestras prácticas con respecto a sus datos personales.</p>
          </section>
          
          <section>
            <h2>2. Información que Recopilamos</h2>
            <p>Podemos recopilar los siguientes tipos de información:</p>
            <h3>2.1 Información Personal</h3>
            <ul>
              <li>Información de registro: nombre, dirección de correo electrónico, contraseña.</li>
              <li>Información de perfil: foto de perfil, biografía, preferencias.</li>
              <li>Información de facturación: dirección de facturación, detalles de pago (procesados de forma segura por nuestros proveedores de pago).</li>
            </ul>
            <h3>2.2 Información Técnica</h3>
            <ul>
              <li>Datos de uso: cómo interactúa con nuestra plataforma, frecuencia de uso, funciones utilizadas.</li>
              <li>Información del dispositivo: tipo de dispositivo, sistema operativo, navegador, dirección IP.</li>
              <li>Cookies y tecnologías similares: utilizamos cookies para mejorar su experiencia en nuestra plataforma.</li>
            </ul>
            <h3>2.3 Contenido del Usuario</h3>
            <p>Recopilamos el contenido que usted proporciona al utilizar nuestra plataforma, como las descripciones de sistemas y los diagramas generados.</p>
          </section>
          
          <section>
            <h2>3. Cómo Utilizamos su Información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul>
              <li>Proporcionar, mantener y mejorar nuestra plataforma.</li>
              <li>Procesar transacciones y gestionar su cuenta.</li>
              <li>Enviar comunicaciones relacionadas con el servicio, actualizaciones y promociones.</li>
              <li>Personalizar su experiencia y ofrecer contenido relevante.</li>
              <li>Analizar y mejorar la seguridad, rendimiento y funcionalidad de nuestra plataforma.</li>
              <li>Cumplir con obligaciones legales y resolver disputas.</li>
            </ul>
          </section>
          
          <section>
            <h2>4. Compartición de Información</h2>
            <p>No vendemos sus datos personales a terceros. Sin embargo, podemos compartir su información en las siguientes circunstancias:</p>
            <ul>
              <li>Con proveedores de servicios que nos ayudan a operar nuestra plataforma (procesadores de pago, servicios de análisis, proveedores de hosting).</li>
              <li>En respuesta a solicitudes legales (orden judicial, citación) o para proteger nuestros derechos.</li>
              <li>En caso de fusión, venta o transferencia de activos, su información puede ser transferida como parte de la transacción.</li>
              <li>Con su consentimiento o indicación.</li>
            </ul>
          </section>
          
          <section>
            <h2>5. Seguridad de los Datos</h2>
            <p>Implementamos medidas técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, pérdida o alteración. Sin embargo, ninguna transmisión por Internet o almacenamiento electrónico es 100% segura, por lo que no podemos garantizar su seguridad absoluta.</p>
          </section>
          
          <section>
            <h2>6. Sus Derechos</h2>
            <p>Dependiendo de su ubicación, puede tener derechos relacionados con sus datos personales, incluyendo:</p>
            <ul>
              <li>Acceder a sus datos personales.</li>
              <li>Corregir datos inexactos.</li>
              <li>Eliminar sus datos personales.</li>
              <li>Oponerse al procesamiento de sus datos.</li>
              <li>Portabilidad de datos.</li>
              <li>Retirar el consentimiento en cualquier momento.</li>
            </ul>
            <p>Para ejercer estos derechos, contáctenos a través de kodeandoando2023@gmail.com.</p>
          </section>
          
          <section>
            <h2>7. Retención de Datos</h2>
            <p>Conservamos sus datos personales durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que se requiera o permita un período de retención más largo por ley.</p>
            <p>Si cierra su cuenta, sus datos se eliminarán o anonimizarán después de un período razonable, a menos que estemos obligados a conservarlos por ley.</p>
          </section>
          
          <section>
            <h2>8. Transferencias Internacionales</h2>
            <p>Su información puede ser transferida y procesada en países distintos al suyo, donde nuestros servidores están ubicados. Estas jurisdicciones pueden tener leyes de protección de datos diferentes a las de su país.</p>
            <p>Al utilizar nuestra plataforma, usted consiente la transferencia de su información a estos países.</p>
          </section>
          
          <section>
            <h2>9. Cambios a esta Política</h2>
            <p>Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos cualquier cambio material publicando la nueva política en nuestra plataforma y actualizando la fecha de &quot;última actualización&quot;.</p>
            <p>Se recomienda revisar esta política regularmente para estar informado sobre cómo protegemos su información.</p>
          </section>
          
          <section>
            <h2>10. Contacto</h2>
            <p>Si tiene preguntas o inquietudes sobre esta Política de Privacidad, por favor contáctenos a: kodeandoando2023@gmail.com</p>
          </section>
        </div>
      </main>
      
      <footer className="bg-base-300 text-base-content py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm"> SysDiagramAI. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/legal/privacy" className="text-sm link link-hover">Política de Privacidad</Link>
            <Link href="/legal/terms" className="text-sm link link-hover">Términos y Condiciones</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
