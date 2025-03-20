"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useSubscription } from '@/app/context/SubscriptionContext';
import SubscriptionNav from "../subscription/SubscriptionNav";

// Definimos los elementos de navegación
const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
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
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Mis Requisitos",
    href: "/dashboard/requirements",
    icon: (
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
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    name: "Crear Diagrama",
    href: "/dashboard/create",
    icon: (
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
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
  },
  {
    name: "Suscripción",
    href: "/subscription",
    icon: (
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
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    name: "Mi Perfil",
    href: "/dashboard/profile",
    icon: (
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
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { subscription, loading: loadingSubscription } = useSubscription();

  return (
    <>
      {/* Overlay para dispositivos móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-base-100 shadow-lg z-50 transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-0 lg:w-16 xl:w-64"} 
          overflow-hidden lg:sticky
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo y título */}
          <div className="p-4 border-b border-base-200">
            <Link href="/dashboard" className="flex items-center">
              <div className="w-10 h-10 bg-primary bg-opacity-90 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3 shadow-sm">
                SD
              </div>
              <div
                className={`flex flex-col ${!isOpen && "lg:hidden xl:flex"}`}
              >
                <div className="flex items-center">
                  <span className="font-bold text-xl text-primary">
                    Sys
                    <span className="text-primary-focus">Diagram</span>
                  </span>
                  <span className="text-xl text-secondary font-bold">AI</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Perfil de usuario */}
          <div className={`p-4 ${isOpen ? "" : "hidden md:block"}`}>
            <div className="flex items-center gap-3">
              <div className="avatar">
                {session?.user?.image ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden relative">
                    <Image
                      src={session.user.image}
                      alt={`Avatar de ${session?.user?.name || "Usuario"}`}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-base-content flex items-center justify-center">
                    {session?.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </div>
              <div className={`flex-1 ${isOpen ? "block" : "hidden lg:block"}`}>
                <div className="font-semibold text-base-content text-sm">
                  {session?.user?.name || "Usuario"}
                </div>
                <div className="text-xs text-base-content/70 truncate max-w-[140px]">
                  {session?.user?.email || ""}
                </div>
              </div>
            </div>
          </div>

          {/* Información de suscripción */}
          {!loadingSubscription && subscription && isOpen && (
            <div className="px-4 pb-2">
              <SubscriptionNav />
            </div>
          )}

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center p-3 rounded-lg transition-colors
                        ${
                          isActive
                            ? "bg-primary text-primary-content"
                            : "text-base-content hover:bg-base-200"
                        }
                      `}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className={`${!isOpen && "lg:hidden xl:inline"}`}>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-base-200">
            {/* Botón de actualización para usuarios con plan gratuito */}
            {!loadingSubscription && subscription && subscription.plan === 'free' && isOpen && (
              <Link 
                href="/subscription"
                className="flex items-center w-full p-3 mb-2 rounded-lg text-primary hover:bg-base-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Actualizar Plan</span>
              </Link>
            )}
            
            <button
              onClick={async () => {
                try {
                  await signOut({
                    redirect: true,
                    callbackUrl: "/auth/signin",
                  });
                } catch (error) {
                  console.error("Error al cerrar sesión:", error);
                  window.location.href = "/auth/signin";
                }
              }}
              className="flex items-center w-full p-3 rounded-lg text-error hover:bg-base-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              <span className={`${!isOpen && "lg:hidden xl:inline"}`}>
                Cerrar Sesión
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
