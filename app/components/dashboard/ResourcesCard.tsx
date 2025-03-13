'use client';

import Link from "next/link";

export default function ResourcesCard() {
  return (
    <div className="card text-base-content bg-base-100 shadow-md h-full">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4">Recursos y Tutoriales</h2>
        
        <ul className="space-y-3 mb-4">
          <li className="p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
            <Link href="/resources/getting-started" className="flex items-start">
              <div className="bg-primary bg-opacity-20 text-primary p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Comenzando con SysDiagramAI</p>
                <p className="text-xs text-base-content/70 mt-1">Aprende los conceptos básicos para crear diagramas</p>
              </div>
            </Link>
          </li>
          
          <li className="p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
            <Link href="/resources/system-design" className="flex items-start">
              <div className="bg-secondary bg-opacity-20 text-secondary p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Patrones de Diseño de Sistemas</p>
                <p className="text-xs text-base-content/70 mt-1">Mejora tus diseños con patrones comunes</p>
              </div>
            </Link>
          </li>
          
          <li className="p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
            <Link href="/resources/collaboration" className="flex items-start">
              <div className="bg-accent bg-opacity-20 text-accent p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Colaboración en Equipo</p>
                <p className="text-xs text-base-content/70 mt-1">Aprende a trabajar en diagramas con tu equipo</p>
              </div>
            </Link>
          </li>
        </ul>
        
        <div className="card-actions justify-end">
          <Link href="/resources" className="btn btn-sm btn-ghost">
            Explorar recursos →
          </Link>
        </div>
      </div>
    </div>
  );
}
