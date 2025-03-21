"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
//import { themeChange } from 'theme-change';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Inicializar theme-change cuando el componente se monta
  useEffect(() => {
    // Importante: llamar a themeChange() para inicializar
    //themeChange(false);

    // Comprobar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem("theme");
    // Si no hay tema guardado, establecer el tema por defecto
    if (!savedTheme) {
      localStorage.setItem("theme", "dark");
    }
  }, []);

  // Función para cambiar el tema manualmente
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-50 border-b border-base-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="navbar py-3">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-base-content"
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
              </div>
              {isMenuOpen && (
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 mt-3"
                >
                  <li>
                    <Link
                      href="#features"
                      onClick={() => setIsMenuOpen(false)}
                      className="font-medium text-base-content hover:text-primary transition-colors"
                    >
                      Características
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      onClick={() => setIsMenuOpen(false)}
                      className="font-medium text-base-content hover:text-primary transition-colors"
                    >
                      Precios
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#faq"
                      onClick={() => setIsMenuOpen(false)}
                      className="font-medium text-base-content hover:text-primary transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                  <div className="border-t border-base-200 my-2 lg:hidden"></div>
                  <li className="lg:hidden">
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="font-medium text-base-content hover:text-primary transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li className="lg:hidden">
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="font-medium text-primary hover:text-primary-focus transition-colors"
                    >
                      Registrarse
                      <span className="badge badge-sm badge-primary text-white ml-1">Nuevo</span>
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-primary bg-opacity-90 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3 shadow-sm">
                SD
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="font-bold text-xl text-primary">
                    Sys
                    <span className="text-primary-focus">Diagram</span>
                  </span>
                  <span className="text-xl text-secondary font-bold">AI</span>
                </div>
                <span className="text-xs text-base-content opacity-80">
                  Diagramas Inteligentes
                </span>
              </div>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link
                  href="#features"
                  className="font-medium text-base-content hover:text-primary transition-colors"
                >
                  Características
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="font-medium text-base-content hover:text-primary transition-colors"
                >
                  Precios
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="font-medium text-base-content hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="navbar-end">
            <label className="swap swap-rotate btn btn-ghost bg-base-200 btn-circle mr-2 shadow-sm border border-base-300">
              <input
                type="checkbox"
                onClick={toggleTheme}
                className="theme-controller"
                data-toggle-theme="dark,light"
                data-act-class="swap-active"
              />

              {/* Icono del sol - modo claro */}
              <svg
                className="swap-off fill-current w-5 h-5 text-neutral"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* Icono de la luna - modo oscuro */}
              <svg
                className="swap-on fill-current w-5 h-5 text-base-content"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>

            <div className="hidden lg:flex items-center">
              <Link href="/auth/signin" className="btn btn-ghost btn-sm text-base-content hover:bg-base-200">
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/signup"
                className="btn btn-primary text-white btn-sm hover:bg-primary-focus transition-colors"
              >
                <span>Registrarse</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
