'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-base-300 text-base-content">
      <div className="container mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Versión móvil optimizada con mejor distribución */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:gap-8 md:footer">
          <div>
            <span className="text-base font-semibold md:footer-title mb-2 block">Producto</span>
            <div className="flex flex-col gap-1 md:gap-2">
              <Link href="#features" className="link link-hover text-sm md:text-base">Características</Link>
              <Link href="#pricing" className="link link-hover text-sm md:text-base">Precios</Link>
              <Link href="#faq" className="link link-hover text-sm md:text-base">FAQ</Link>
            </div>
          </div>
          <div>
            <span className="text-base font-semibold md:footer-title mb-2 block">Recursos</span>
            <div className="flex flex-col gap-1 md:gap-2">
              <Link href="/documentation" className="link link-hover text-sm md:text-base">Documentación</Link>
              <Link href="#" className="link link-hover text-sm md:text-base">Blog</Link>
              <Link href="#" className="link link-hover text-sm md:text-base">Tutoriales</Link>
            </div>
          </div>
          <div>
            <span className="text-base font-semibold md:footer-title mb-2 block">Legal</span>
            <div className="flex flex-col gap-1 md:gap-2">
              <Link href="/legal/terms" className="link link-hover text-sm md:text-base">Términos de uso</Link>
              <Link href="/legal/privacy" className="link link-hover text-sm md:text-base">Política de privacidad</Link>
              <Link href="/legal/cookies" className="link link-hover text-sm md:text-base">Política de cookies</Link>
            </div>
          </div>
          <div>
            <span className="text-base font-semibold md:footer-title mb-2 block">Contacto</span>
            <div className="flex flex-col gap-1 md:gap-2">
              <Link href="/support" className="link link-hover text-sm md:text-base">Soporte</Link>
              <Link href="/sales" className="link link-hover text-sm md:text-base">Ventas</Link>
              <Link href="#" className="link link-hover text-sm md:text-base break-all">kodeandoando2023@gmail.com</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 md:py-6 border-t border-base-content/10 text-center">
        <p className="text-xs md:text-sm"> {currentYear} SysDiagramAI. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
} 