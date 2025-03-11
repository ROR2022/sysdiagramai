import { Resend } from 'resend';

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_KEY);

// Dirección desde la que se envían los emails (debe coincidir con la configurada en Auth.js)
const fromEmail = 'noreply@resend.mysteryboxapp.lat';

/**
 * Envía un email de verificación con un enlace para verificar la cuenta
 * @param to Email de destino
 * @param name Nombre del usuario
 * @param verificationUrl URL de verificación que incluye el token
 * @returns Resultado del envío
 */
export async function sendVerificationEmail(
  to: string, 
  name: string, 
  verificationUrl: string
) {
  try {
    console.log("[Email] Enviando email de verificación a:", to);
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: to,
      subject: 'Verifica tu cuenta - SysDiagramAI',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6; margin-bottom: 24px;">Hola ${name}!</h1>
          
          <p style="margin-bottom: 16px; font-size: 16px; line-height: 24px;">
            Gracias por registrarte en SysDiagramAI. Por favor verifica tu email haciendo clic en el siguiente enlace:
          </p>
          
          <div style="margin: 32px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verificar mi email
            </a>
          </div>
          
          <p style="margin-bottom: 16px; font-size: 16px; line-height: 24px;">
            Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:
          </p>
          
          <p style="margin-bottom: 32px; word-break: break-all; 
                    padding: 16px; background-color: #f3f4f6; border-radius: 4px;">
            ${verificationUrl}
          </p>
          
          <p style="margin-bottom: 8px; font-size: 16px; line-height: 24px;">
            Si no has creado esta cuenta, puedes ignorar este email.
          </p>
          
          <hr style="margin: 32px 0; border: 0; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            &copy; ${new Date().getFullYear()} SysDiagramAI. Todos los derechos reservados.
          </p>
        </div>
      `
    });
    
    console.log("[Email] ✅ Email enviado correctamente:", result);
    return result;
  } catch (error) {
    console.error("[Email] ❌ Error al enviar email:", error);
    throw error;
  }
} 