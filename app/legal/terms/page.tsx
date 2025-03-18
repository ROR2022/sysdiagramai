'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
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
          <h1>Términos y Condiciones</h1>
          <p className="text-sm text-base-content/70">Última actualización: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2>1. Introducción</h2>
            <p>Bienvenido a SysDiagramAI (&quot;nosotros&quot;, &quot;nuestro&quot;, o &quot;la Plataforma&quot;). Al acceder o utilizar nuestra plataforma, usted acepta estar legalmente vinculado por estos Términos y Condiciones (&quot;Términos&quot;). Si no está de acuerdo con estos Términos, por favor no utilice la Plataforma.</p>
          </section>
          
          <section>
            <h2>2. Definiciones</h2>
            <p>&quot;Usuario&quot; se refiere a cualquier persona que accede o utiliza la Plataforma.</p>
            <p>&quot;Contenido&quot; se refiere a cualquier información, datos, texto, software, gráficos, mensajes u otros materiales.</p>
            <p>&quot;Servicios&quot; se refiere a todas las funcionalidades, herramientas y servicios proporcionados a través de la Plataforma.</p>
          </section>
          
          <section>
            <h2>3. Uso de la Plataforma</h2>
            <p>SysDiagramAI proporciona una herramienta basada en inteligencia artificial para la creación de diagramas de sistemas. El uso de nuestra plataforma está sujeto a las siguientes condiciones:</p>
            <ul>
              <li>Debe ser mayor de 18 años o tener el consentimiento de un tutor legal.</li>
              <li>Es responsable de mantener la confidencialidad de sus credenciales de cuenta.</li>
              <li>Acepta utilizar la plataforma solo para fines legales y de acuerdo con estos Términos.</li>
              <li>No utilizará la plataforma de manera que pueda dañar, deshabilitar o sobrecargar los servidores.</li>
            </ul>
          </section>
          
          <section>
            <h2>4. Suscripciones y Pagos</h2>
            <p>SysDiagramAI ofrece diferentes planes de suscripción con distintos niveles de funcionalidad. Al adquirir una suscripción:</p>
            <ul>
              <li>Acepta pagar todas las tarifas asociadas con su plan seleccionado.</li>
              <li>Los pagos son no reembolsables, excepto cuando lo exija la ley aplicable.</li>
              <li>Nos reservamos el derecho de modificar las tarifas con un aviso previo de 30 días.</li>
              <li>Puede cancelar su suscripción en cualquier momento, efectiva al final del período de facturación actual.</li>
            </ul>
          </section>
          
          <section>
            <h2>5. Propiedad Intelectual</h2>
            <p>Todo el contenido presente en la plataforma, incluyendo pero no limitado a texto, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de SysDiagramAI o sus proveedores de contenido y está protegido por leyes de propiedad intelectual.</p>
            <p>Los diagramas generados por los usuarios utilizando nuestra plataforma pertenecen a los usuarios, sin embargo, nos reservamos el derecho de utilizar datos anónimos y agregados para mejorar nuestros algoritmos y servicios.</p>
          </section>
          
          <section>
            <h2>6. Limitación de Responsabilidad</h2>
            <p>SysDiagramAI proporciona la plataforma &quot;tal cual&quot; y &quot;según disponibilidad&quot;, sin garantías de ningún tipo. No garantizamos que la plataforma sea ininterrumpida, oportuna, segura o libre de errores.</p>
            <p>En ningún caso SysDiagramAI, sus directores, empleados o agentes serán responsables por cualquier daño indirecto, incidental, especial, consecuente o punitivo que surja de o en conexión con su uso de la plataforma.</p>
          </section>
          
          <section>
            <h2>7. Indemnización</h2>
            <p>Usted acepta indemnizar y mantener indemne a SysDiagramAI y sus afiliados, funcionarios, agentes y empleados de cualquier reclamo, responsabilidad, daño, pérdida y gasto (incluidos los honorarios y costos legales razonables) que surjan de o estén relacionados con su uso de la plataforma o cualquier violación de estos Términos.</p>
          </section>
          
          <section>
            <h2>8. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma. Su uso continuado de la plataforma después de dichas modificaciones constituirá su aceptación de los nuevos términos.</p>
          </section>
          
          <section>
            <h2>9. Ley Aplicable</h2>
            <p>Estos Términos se regirán e interpretarán de acuerdo con las leyes de España, sin dar efecto a ningún principio de conflictos de leyes.</p>
          </section>
          
          <section>
            <h2>10. Contacto</h2>
            <p>Si tiene alguna pregunta sobre estos Términos, por favor contáctenos a: kodeandoando2023@gmail.com</p>
          </section>
        </div>
      </main>
      
      <footer className="bg-base-300 text-base-content py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} SysDiagramAI. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/legal/privacy" className="text-sm link link-hover">Política de Privacidad</Link>
            <Link href="/legal/terms" className="text-sm link link-hover">Términos y Condiciones</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
