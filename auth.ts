import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";
import type { NextAuthConfig } from "next-auth";
import { compare } from "bcrypt";
import { getUserByEmail } from "./app/api/utils/users";

// Extender las interfaces de NextAuth para incluir campos personalizados
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            emailVerified?: Date | null;
        } & DefaultSession["user"]
    }
    
    interface User {
        emailVerified?: Date | null;
    }

    interface JWT {
        id?: string;
        emailVerified?: Date | null;
    }
}

// Declaramos explícitamente que este código debe ejecutarse en el entorno Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Configuración de autenticación
export const authConfig: NextAuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            // El nombre que se mostrará en el botón de inicio de sesión
            name: "Credenciales",
            // Las credenciales que se utilizarán para iniciar sesión
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                try {
                    // Verificar que las credenciales existan
                    console.log("credentials...", credentials);
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    /*
                    // Conectar a la base de datos
                    const client = await clientPromise;
                    const db = client.db();
                    
                    // Buscar usuario por email
                    const user = await db.collection("users").findOne({ 
                        email: credentials.email 
                    });
                    */
                   //entonces usemos la funcion getUserByEmail
                   const user = await getUserByEmail(credentials.email as string);
                    
                    // Si no se encuentra el usuario o no tiene contraseña
                    if (!user || !user.password) {
                        return null;
                    }
                    
                    // Verificar contraseña
                    const isPasswordValid = await compare(credentials.password as string, user.password);
                    
                    if (!isPasswordValid) {
                        return null;
                    }
                    
                    // Retornar el usuario sin la contraseña
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        emailVerified: user.emailVerified
                    };
                } catch (error) {
                    console.error("Error en authorize:", error);
                    return null;
                }
            }
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },
    cookies: {
        sessionToken: {
            name: `authjs.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
        callbackUrl: {
            name: `authjs.callback-url`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            }
        },
        csrfToken: {
            name: `authjs.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            }
        }
    },
    callbacks: {
        // Callback para JWT
        jwt: ({ token, user, trigger, session }) => {
            // Cuando hay una actualización explícita
            if (trigger === "update" && session?.user) {
              // Actualizar el token con los datos de session
              return {
                ...token,
                ...session.user
              };
            }
            
            // Si es un nuevo inicio de sesión, actualizar con datos del usuario
            if (user) {
              token.id = user.id;
              token.email = user.email;
              token.emailVerified = user.emailVerified;
            }
            
            return token;
          },
        // Callback para Session
        session: ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.id as string;
                // Usar aserciones de tipo para manejar el tipo emailVerified
                session.user.emailVerified = token.emailVerified as Date | null;
            }
            return session;
        },
    },
    events: {
        // Eventos para depuración
        signIn: ({ user, account, isNewUser }) => {
            if (process.env.NODE_ENV === 'development') {
                console.log('[Auth] Usuario inició sesión:', {
                    userId: user.id,
                    email: user.email,
                    provider: account?.provider,
                    isNewUser
                });
            }
        },
    },
};

// Instancia de NextAuth con la configuración
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);


// Logger personalizado para errores de autenticación
if (process.env.NODE_ENV === 'development') {
    console.log("[Auth] Configuración de autenticación inicializada con depuración");
}        