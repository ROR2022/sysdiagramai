'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-focus text-primary-content">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Transforma tus ideas en diagramas profesionales
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Comienza a diseñar sistemas mejores hoy mismo. Regístrate gratis y obtén tus primeros 3 diagramas sin costo.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/auth/signin" className="btn btn-secondary btn-lg">
            Empezar Gratis
          </Link>
          <Link href="#features" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary">
            Saber Más
          </Link>
        </div>
      </div>
    </section>
  );
} 