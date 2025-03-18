'use client';

import { useState } from 'react';
import Link from 'next/link';

// Datos de las preguntas frecuentes
const faqs = [
  {
    question: '¿Qué es SysDiagramAI?',
    answer: 'SysDiagramAI es una plataforma innovadora que utiliza inteligencia artificial para generar diagramas de arquitectura de sistemas de forma automática. Solo necesitas describir tu sistema o proyecto, y nuestra IA creará diagramas profesionales en segundos.'
  },
  {
    question: '¿Qué tipos de diagramas puedo crear?',
    answer: 'Puedes crear una amplia variedad de diagramas, incluyendo arquitecturas de sistemas, diagramas de flujo, diagramas de secuencia, esquemas de bases de datos, diagramas de red, arquitecturas de microservicios, y más. La plataforma se adapta a tus necesidades específicas.'
  },
  {
    question: '¿Necesito conocimientos técnicos para usar SysDiagramAI?',
    answer: 'No. SysDiagramAI está diseñado para ser fácil de usar tanto para expertos técnicos como para principiantes. Solo tienes que describir lo que necesitas en lenguaje natural, y nuestra IA se encargará del resto.'
  },
  {
    question: '¿Puedo editar los diagramas generados?',
    answer: 'Sí, todos los diagramas generados son completamente editables. Puedes ajustar componentes, cambiar estilos, añadir elementos, o modificar conexiones después de la generación inicial para personalizar el diagrama según tus necesidades exactas.'
  },
  {
    question: '¿En qué formatos puedo exportar mis diagramas?',
    answer: 'Ofrecemos múltiples formatos de exportación, incluyendo PNG, SVG, PDF, y formatos editables compatibles con herramientas populares como Visio, Draw.io, y Lucidchart. También puedes obtener el código fuente para PlantUML o Mermaid.'
  },
  {
    question: '¿Mis datos están seguros?',
    answer: 'Absolutamente. La seguridad de tus datos es nuestra prioridad. Utilizamos cifrado de extremo a extremo y no almacenamos permanentemente la información sensible de tus sistemas. Además, ofrecemos opciones de implementación privada para empresas con requisitos estrictos de seguridad.'
  },
  {
    question: '¿Cómo funciona la suscripción?',
    answer: 'Ofrecemos varios planes, incluyendo una opción gratuita con funcionalidades limitadas. Las suscripciones de pago se facturan mensual o anualmente, con descuentos para pagos anuales. Puedes cancelar en cualquier momento, y ofrecemos un período de prueba de 14 días para planes de pago.'
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-8 md:py-16 bg-base-100 relative">
      {/* Elementos decorativos - Ocultos en móvil para mejor rendimiento */}
      <div className="absolute inset-0 overflow-hidden opacity-5 dark:opacity-10 hidden md:block">
        <div className="absolute -right-40 top-20 w-80 h-80 rounded-full bg-primary/30 blur-3xl"></div>
        <div className="absolute -left-40 bottom-20 w-80 h-80 rounded-full bg-secondary/30 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-block bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2 md:mb-4 shadow-sm">
            Preguntas frecuentes
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-base-content">Dudas comunes</h2>
          <p className="text-base md:text-lg text-base-content/80 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más frecuentes sobre SysDiagramAI.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto divide-y divide-base-300 bg-base-100/50 backdrop-blur-sm shadow-md md:shadow-lg rounded-lg md:rounded-xl p-4 md:p-6 dark:bg-base-200/30">
          {faqs.map((faq, index) => (
            <div key={index} className={`py-3 md:py-5 ${index === 0 ? '' : 'border-t border-base-300'}`}>
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full text-left group"
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-base md:text-lg font-medium text-base-content group-hover:text-primary transition-colors pr-2">
                  {faq.question}
                </h3>
                <span 
                  className={`flex-shrink-0 transition-all duration-300 text-base-content/70 group-hover:text-primary ${
                    activeIndex === index ? 'rotate-180 text-primary' : ''
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
              
              <div 
                id={`faq-answer-${index}`}
                className={`mt-2 md:mt-3 text-sm md:text-base text-base-content/80 overflow-hidden transition-all duration-300 ${
                  activeIndex === index 
                    ? 'max-h-[500px] opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="pb-2">{faq.answer}</p>
                <div className={`w-full h-px bg-gradient-to-r from-transparent via-base-300 to-transparent opacity-0 transition-opacity duration-300 ${
                  activeIndex === index ? 'opacity-100 delay-300' : ''
                }`}></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6 md:mt-10">
          <p className="text-sm md:text-base text-base-content/70 mb-2 md:mb-3">¿No encuentras lo que buscas?</p>
          <Link href="/support" className="btn btn-outline btn-primary btn-xs md:btn-sm hover:bg-primary/10">
            Contacta con nosotros
          </Link>
        </div>
      </div>
    </section>
  );
} 