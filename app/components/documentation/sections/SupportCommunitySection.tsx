import Link from 'next/link';
import DocSection from '../DocSection';
import DocSubsection from '../DocSubsection';
import DocCard from '../DocCard';
import DocAlert from '../DocAlert';

export default function SupportCommunitySection() {
  return (
    <DocSection id="support-community" title="Soporte y Comunidad">
      <p>Estamos comprometidos a proporcionar un excelente soporte a nuestros usuarios y fomentar una comunidad activa alrededor de SysDiagramAI.</p>
      
      <DocSubsection title="Opciones de Soporte">
        <p>Ofrecemos múltiples canales para resolver dudas y problemas:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <DocCard title="Base de Conocimiento">
            <p>Nuestra extensa base de conocimiento contiene respuestas a preguntas frecuentes, tutoriales y soluciones a problemas comunes.</p>
            <div className="mt-4">
              <Link href="/support" className="btn btn-sm btn-primary">
                Visitar Base de Conocimiento
              </Link>
            </div>
          </DocCard>
          
          <DocCard title="Soporte por Email">
            <p>Para consultas específicas, nuestro equipo de soporte está disponible por email.</p>
            <p className="mt-2">
              <a href="mailto:kodeandoando2023@gmail.com" className="link link-primary">kodeandoando2023@gmail.com</a>
            </p>
            <p className="text-sm mt-2">Tiempo de respuesta típico: 24-48 horas (días laborables)</p>
          </DocCard>
        </div>
        
        <DocAlert type="info" title="Soporte Premium">
          <p>Los usuarios de planes Profesional y Empresarial tienen acceso a soporte prioritario con tiempos de respuesta más rápidos y asistencia personalizada.</p>
        </DocAlert>
      </DocSubsection>
      
      <DocSubsection title="Comunidad">
        <p>Únete a nuestra creciente comunidad de diseñadores de sistemas y desarrolladores:</p>
        <ul>
          <li><strong>Foro de Usuarios:</strong> Comparte experiencias, consejos y soluciones con otros usuarios</li>
          <li><strong>Canal de Discord:</strong> Participa en discusiones en tiempo real y conecta con expertos</li>
          <li><strong>Webinars Mensuales:</strong> Aprende sobre las últimas tendencias en diseño de sistemas</li>
          <li><strong>Eventos Virtuales:</strong> Talleres prácticos y sesiones de preguntas y respuestas</li>
        </ul>
        
        <DocCard title="Programa de Embajadores">
          <p>Para usuarios entusiastas que desean involucrarse más profundamente:</p>
          <ul>
            <li>Acceso anticipado a nuevas funcionalidades</li>
            <li>Oportunidades para contribuir al desarrollo del producto</li>
            <li>Reconocimiento en nuestra página web y materiales promocionales</li>
            <li>Beneficios exclusivos y descuentos especiales</li>
          </ul>
        </DocCard>
      </DocSubsection>
      
      <DocSubsection title="Reporte de Problemas">
        <p>Si encuentras algún error o problema técnico:</p>
        <ol>
          <li>Verifica en la base de conocimiento si ya existe una solución</li>
          <li>Si el problema persiste, reporta el error a través de la opción &quot;Reportar un Problema&quot; en el menú de tu cuenta</li>
          <li>Incluye los siguientes detalles para ayudarnos a diagnosticar el problema:
            <ul>
              <li>Pasos para reproducir el error</li>
              <li>Capturas de pantalla o grabaciones si es posible</li>
              <li>Navegador y sistema operativo que estás utilizando</li>
              <li>Cualquier mensaje de error que hayas recibido</li>
            </ul>
          </li>
        </ol>
        
        <DocAlert type="warning" title="Problemas críticos">
          <p>Para problemas que afecten la seguridad o impidan completamente el uso de la plataforma, contacta directamente con nuestro equipo técnico en <a href="mailto:kodeandoando2023@gmail.com" className="link">kodeandoando2023@gmail.com</a> con el asunto &quot;URGENTE: [Descripción del problema]&quot;.</p>
        </DocAlert>
      </DocSubsection>
      
      <DocSubsection title="Feedback y Sugerencias">
        <p>Valoramos enormemente tus comentarios y sugerencias para mejorar SysDiagramAI:</p>
        <ul>
          <li>Utiliza el formulario &quot;Enviar Sugerencia&quot; en la sección de soporte</li>
          <li>Participa en nuestras encuestas periódicas de satisfacción</li>
          <li>Comparte tus ideas en el foro de la comunidad</li>
        </ul>
        <p>Revisamos activamente todo el feedback y lo incorporamos en nuestra hoja de ruta de producto.</p>
      </DocSubsection>
    </DocSection>
  );
}
