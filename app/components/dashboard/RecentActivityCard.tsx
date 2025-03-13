'use client';

import Link from "next/link";

export default function RecentActivityCard() {
  return (
    <div className="card text-base-content bg-base-100 shadow-md h-full">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4">Actividad Reciente</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="bg-info bg-opacity-20 text-info p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Nuevo diagrama creado</p>
              <p className="text-xs text-base-content/70">Modelo de Base de Datos</p>
              <p className="text-xs text-base-content/50">Hace 2 horas</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <div className="bg-success bg-opacity-20 text-success p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Diagrama completado</p>
              <p className="text-xs text-base-content/70">Arquitectura Microservicios</p>
              <p className="text-xs text-base-content/50">Ayer</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <div className="bg-warning bg-opacity-20 text-warning p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Diagrama editado</p>
              <p className="text-xs text-base-content/70">Diseño de API</p>
              <p className="text-xs text-base-content/50">Hace 2 días</p>
            </div>
          </li>
        </ul>
        
        <div className="card-actions justify-end mt-4">
          <Link href="/dashboard/activity" className="btn btn-sm btn-ghost">
            Ver todo →
          </Link>
        </div>
      </div>
    </div>
  );
}
