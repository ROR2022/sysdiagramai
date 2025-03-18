'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CookiesPage() {
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
          <h1>Política de Cookies</h1>
          <p className="text-sm text-base-content/70">Última actualización: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2>1. ¿Qué son las Cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computadora, tablet o móvil) cuando visita un sitio web. Las cookies son ampliamente utilizadas para hacer que los sitios web funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.</p>
          </section>
          
          <section>
            <h2>2. Cómo Utilizamos las Cookies</h2>
            <p>SysDiagramAI utiliza cookies por varias razones. Utilizamos cookies para entender cómo se utiliza nuestra plataforma y para mejorar la experiencia del usuario. Los tipos de cookies que utilizamos incluyen:</p>
            
            <h3>2.1 Cookies Esenciales</h3>
            <p>Estas cookies son necesarias para el funcionamiento de nuestra plataforma. Incluyen, por ejemplo, cookies que le permiten iniciar sesión en áreas seguras de nuestro sitio web, utilizar un carrito de compras o utilizar servicios de facturación electrónica.</p>
            
            <h3>2.2 Cookies Analíticas/de Rendimiento</h3>
            <p>Estas cookies nos permiten reconocer y contar el número de visitantes y ver cómo los visitantes se mueven por nuestro sitio web cuando lo están utilizando. Esto nos ayuda a mejorar el funcionamiento de nuestro sitio web, por ejemplo, asegurando que los usuarios encuentren fácilmente lo que están buscando.</p>
            
            <h3>2.3 Cookies de Funcionalidad</h3>
            <p>Estas cookies se utilizan para reconocerlo cuando regresa a nuestra plataforma. Esto nos permite personalizar nuestro contenido para usted, saludarlo por su nombre y recordar sus preferencias (por ejemplo, su elección de idioma o región).</p>
            
            <h3>2.4 Cookies de Orientación/Publicitarias</h3>
            <p>Estas cookies registran su visita a nuestra plataforma, las páginas que ha visitado y los enlaces que ha seguido. Utilizamos esta información para hacer que nuestra plataforma y la publicidad mostrada en ella sean más relevantes para sus intereses.</p>
          </section>
          
          <section>
            <h2>3. Control de Cookies</h2>
            <p>Puede controlar y/o eliminar las cookies según lo desee. Puede eliminar todas las cookies que ya están en su computadora y puede configurar la mayoría de los navegadores para evitar que se coloquen. Sin embargo, si hace esto, es posible que tenga que ajustar manualmente algunas preferencias cada vez que visite un sitio y que algunos servicios y funcionalidades no funcionen.</p>
            
            <p>Para más información sobre cómo gestionar las cookies, visite <Link href="https://www.aboutcookies.org/" target="_blank" className="link link-primary">aboutcookies.org</Link> o <Link href="https://www.allaboutcookies.org/" target="_blank" className="link link-primary">allaboutcookies.org</Link>.</p>
          </section>
          
          <section>
            <h2>4. Cookies de Terceros</h2>
            <p>En algunos casos especiales, también utilizamos cookies proporcionadas por terceros de confianza. Nuestra plataforma utiliza servicios de análisis que nos ayudan a entender cómo utiliza el sitio y cómo podemos mejorar su experiencia. Estas cookies pueden rastrear cosas como cuánto tiempo pasa en el sitio y las páginas que visita para que podamos seguir produciendo contenido atractivo.</p>
          </section>
          
          <section>
            <h2>5. Consentimiento</h2>
            <p>Al utilizar nuestra plataforma, usted acepta nuestro uso de cookies de acuerdo con esta política. Si no está de acuerdo, debe configurar su navegador para rechazar cookies o abstenerse de usar nuestra plataforma.</p>
          </section>
          
          <section>
            <h2>6. Cambios en Nuestra Política de Cookies</h2>
            <p>Cualquier cambio que podamos hacer en nuestra política de cookies en el futuro se publicará en esta página. Por favor, revise esta política regularmente para estar informado de cualquier actualización.</p>
          </section>
          
          <section>
            <h2>7. Contacto</h2>
            <p>Si tiene preguntas específicas sobre nuestra política de cookies, por favor contáctenos a: kodeandoando2023@gmail.com</p>
          </section>
        </div>
      </main>
      
      <footer className="bg-base-300 text-base-content py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm"> SysDiagramAI. Todos los derechos reservados.</p>
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
