'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { ThemeController } from '../ThemeController';

interface TopbarProps {
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const { data: session } = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-40 border-b border-base-200">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Parte izquierda */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="btn btn-ghost btn-sm text-base-content md:inline-flex lg:hidden"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
            
            {/* Navegación de breadcrumbs - Para mostrar la ubicación actual */}
            <div className="hidden md:flex items-center ml-4">
              <span className="text-base-content/70">Dashboard</span>
              {/* Se pueden añadir más breadcrumbs según la página actual */}
            </div>
          </div>

          {/* Parte central - Buscador */}
          <div className="hidden flex-1 max-w-xl mx-auto px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="input input-bordered input-sm w-full pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-base-content/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Parte derecha - Acciones */}
          <div className="flex items-center space-x-3">
            {/* Botón de crear nuevo diagrama */}
            <Link 
              href="/dashboard/create" 
              className="btn btn-primary btn-sm hidden md:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Diagrama
            </Link>
            
            {/* Selector de tema */}
            <ThemeController />
            
            {/* Perfil de usuario */}
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="btn btn-ghost btn-sm btn-circle avatar"
              >
                {session?.user?.image ? (
                  <div className="w-8 rounded-full overflow-hidden relative">
                    <Image 
                      src={session.user.image} 
                      alt={`Avatar de ${session?.user?.name || 'Usuario'}`}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </button>
              
              {/* Overlay para cerrar el menú al hacer clic fuera */}
              <div 
                className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isProfileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleProfileMenu}
              ></div>
              
              {/* Menú dropdown con posicionamiento específico para móviles */}
              <div 
                className={`
                  dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 z-[100]
                  transition-all duration-300 transform
                  ${isProfileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                  fixed md:absolute top-24 md:top-full right-4 md:right-0 md:mt-2
                `}
              >
                <div className="p-3 border-b border-base-200">
                  <p className="font-medium text-base-content">{session?.user?.name || 'Usuario'}</p>
                  <p className="text-xs text-base-content/70 truncate">{session?.user?.email || 'usuario@ejemplo.com'}</p>
                </div>
                <ul>
                  <li>
                    <Link 
                      href="/dashboard/profile" 
                      className="py-2 text-base-content"
                      onClick={toggleProfileMenu}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Mi Perfil
                    </Link>
                  </li>
                  <div className="border-t border-base-200 my-1"></div>
                  <li>
                    <button
                      onClick={async () => {
                        toggleProfileMenu(); // Cerrar el menú antes de cerrar sesión
                        try {
                          const { signOut } = await import('next-auth/react');
                          await signOut({ redirect: true, callbackUrl: '/auth/signin' });
                        } catch (error) {
                          console.error('Error al cerrar sesión:', error);
                          window.location.href = '/auth/signin';
                        }
                      }}
                      className="text-error py-2 w-full text-left flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                        />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Buscador móvil - se oculta cuando el menú desplegable está abierto */}
      <div className={`px-4 pb-3 hidden transition-opacity duration-300 ${isProfileMenuOpen ? 'hidden' : 'block'}`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            className="input input-bordered input-sm w-full pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-base-content/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}