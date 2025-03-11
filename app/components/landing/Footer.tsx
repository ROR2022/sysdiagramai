'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-base-300 text-base-content">
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="footer grid-cols-2 sm:grid-cols-4">
          <div>
            <span className="footer-title">Producto</span>
            <Link href="#features" className="link link-hover">Características</Link>
            <Link href="#pricing" className="link link-hover">Precios</Link>
            <Link href="#faq" className="link link-hover">FAQ</Link>
          </div>
          <div>
            <span className="footer-title">Recursos</span>
            <Link href="#" className="link link-hover">Documentación</Link>
            <Link href="#" className="link link-hover">Blog</Link>
            <Link href="#" className="link link-hover">Tutoriales</Link>
          </div>
          <div>
            <span className="footer-title">Legal</span>
            <Link href="#" className="link link-hover">Términos de uso</Link>
            <Link href="#" className="link link-hover">Política de privacidad</Link>
            <Link href="#" className="link link-hover">Cookies</Link>
          </div>
          <div>
            <span className="footer-title">Contacto</span>
            <Link href="#" className="link link-hover">Soporte</Link>
            <Link href="#" className="link link-hover">Ventas</Link>
            <Link href="#" className="link link-hover">info@sysdiagramai.com</Link>
          </div>
        </div>
      </div>
      <div className="py-6 border-t border-base-content/10 text-center">
        <p>© {currentYear} SysDiagramAI. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
} 