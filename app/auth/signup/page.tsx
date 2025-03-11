"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Error durante el registro:", error);
      setError("Ocurrió un error durante el registro con Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log("[SignUpForm] Iniciando registro de usuario...");

    if (!email || !password || !name) {
      console.log("[SignUpForm] Error de validación: campos incompletos");
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("[SignUpForm] Error de validación: formato de email inválido");
      setError("Por favor ingresa un correo electrónico válido");
      setLoading(false);
      return;
    }
    
    // Validar longitud mínima de la contraseña
    if (password.length < 8) {
      console.log("[SignUpForm] Error de validación: contraseña demasiado corta");
      setError("La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    try {
      // Preparamos los datos a enviar
      const userData = { name, email, password };
      console.log("[SignUpForm] Enviando datos al API:", JSON.stringify(userData));
      
      // Enviamos los datos al endpoint de API para el registro
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      // Parseamos la respuesta
      let data;
      try {
        data = await response.json();
        console.log("[SignUpForm] Respuesta del API:", JSON.stringify(data));
      } catch (parseError) {
        console.error("[SignUpForm] Error al parsear la respuesta:", parseError);
        throw new Error("Error al procesar la respuesta del servidor");
      }

      if (!response.ok) {
        // Si la respuesta no es exitosa, mostramos el error
        console.error("[SignUpForm] Error en la respuesta:", response.status, data?.error);
        throw new Error(data?.error || `Error al registrar usuario: ${response.status}`);
      }

      console.log("[SignUpForm] Registro exitoso:", data);

      // Si el registro es exitoso, redirigimos directamente a la página de verificación
      // en lugar de la página de login, esto hace que el usuario vea instrucciones claras
      console.log("[SignUpForm] Redirigiendo a página de verificación de email...");
      router.push("/auth/verify-email");
    } catch (error: unknown) {
      console.error("[SignUpForm] Error durante el registro:", error);
      // Manejamos diferentes tipos de errores de forma segura
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Ocurrió un error durante el registro. Por favor intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">
      {/* Enlace para regresar al inicio */}
      <Link
        href="/"
        className="absolute top-6 left-6 btn btn-ghost btn-circle text-base-content hover:bg-base-300/50 z-20 transition-all duration-300"
        aria-label="Regresar al inicio"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="sr-only">Regresar al inicio</span>
      </Link>

      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-secondary/20 to-transparent dark:from-secondary/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary/20 to-transparent dark:from-primary/10 blur-3xl"></div>
      </div>

      {/* Logo gráfico decorativo */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-primary/10 dark:text-primary/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-32 h-32"
        >
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          <path d="M12 3L2 8.118l10 5 10-5L12 3z" />
        </svg>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-300 dark:border-base-700 w-full max-w-md relative z-10 backdrop-blur-sm bg-base-100/90 dark:bg-base-100/80">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-base-content">
              Crear cuenta
            </h1>
            <p className="text-base-content/70 mt-2">
              Únete a SysDiagramAI y comienza a diseñar
            </p>
          </div>

          {error && (
            <div
              className="bg-error/10 border-l-4 border-error text-error-content p-4 mb-5 rounded-r-md shadow-sm animate-fadeIn"
              role="alert"
            >
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content/80">
                  Nombre completo
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full text-base-content bg-base-200/50 focus:bg-base-200 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                placeholder="Tu nombre"
                required
                aria-label="Nombre completo"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content/80">
                  Correo electrónico
                </span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full text-base-content bg-base-200/50 focus:bg-base-200 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="correo@ejemplo.com"
                required
                aria-label="Correo electrónico"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content/80">
                  Contraseña
                </span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full text-base-content bg-base-200/50 focus:bg-base-200 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Contraseña segura"
                minLength={8}
                required
                aria-label="Contraseña"
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Mínimo 8 caracteres
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full shadow-md hover:shadow-lg transition-all duration-300 hover:brightness-105"
              aria-label="Crear cuenta"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          <div className="relative py-3 mt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-base-300 dark:border-base-600"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-base-100 px-2 text-base-content/60 dark:bg-base-100/80">
                o
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="btn btn-outline text-base-content hover:bg-base-300 hover:text-secondary dark:hover:bg-base-700 w-full flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow"
            aria-label="Registrarse con Google"
          >
            <svg
              className="h-5 w-5 text-primary"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.638-4.139-2.639-6.735-2.639-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10-7.584 10-10 0-0.772-0.098-1.5-0.226-2.177l-9.774 0.448z" />
            </svg>
            <span>Registrarse con Google</span>
          </button>

          <div className="mt-8 text-center text-sm">
            <p className="text-base-content/70">
              Al registrarte, aceptas nuestros{" "}
              <Link
                href="/terms"
                className="link link-hover text-primary font-medium transition-colors"
              >
                Términos de servicio
              </Link>{" "}
              y{" "}
              <Link
                href="/privacy"
                className="link link-hover text-primary font-medium transition-colors"
              >
                Política de privacidad
              </Link>
            </p>
          </div>

          <div className="divider my-6"></div>

          <p className="text-center text-sm text-base-content/60">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/auth/signin"
              className="text-primary font-medium hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
