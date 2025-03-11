import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/libs/mongo";
import { verifyToken } from "@/libs/verification-token";

// Este endpoint verifica tokens de email y marca los emails como verificados
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    console.log("[Verify] Verificando token:", token);

    if (!token) {
      return NextResponse.redirect(new URL("/auth/error?error=MissingToken", request.url));
    }

    const email = await verifyToken(token);

    if (!email) {
      console.log("[Verify] Token inválido o expirado");
      return NextResponse.redirect(new URL("/auth/error?error=InvalidToken", request.url));
    }

    // Marcar email como verificado
    const db = (await clientPromise).db();
    await db.collection("users").updateOne(
      { email: email },
      { $set: { emailVerified: new Date() } }
    );

    console.log("[Verify] ✅ Email verificado correctamente:", email);

    // Redirigir al usuario al inicio de sesión con un mensaje indicando que debe iniciar sesión nuevamente
    return NextResponse.redirect(
      new URL("/auth/signin?message=emailVerified&action=refresh", request.url)
    );
  } catch (error) {
    console.error("[Verify] Error al verificar email:", error);
    return NextResponse.redirect(new URL("/auth/error?error=ServerError", request.url));
  }
} 