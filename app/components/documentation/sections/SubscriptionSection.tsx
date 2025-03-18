import DocSection from '../DocSection';
import DocSubsection from '../DocSubsection';
import DocCard from '../DocCard';
import DocAlert from '../DocAlert';

export default function SubscriptionSection() {
  return (
    <DocSection id="subscription" title="Modelo de Suscripción">
      <p>SysDiagramAI ofrece diferentes planes adaptados a las necesidades específicas de cada usuario, desde desarrolladores individuales hasta grandes equipos.</p>
      
      <DocSubsection title="Planes Disponibles">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
          <DocCard title="Plan Gratuito" className="border-l-4 border-l-info">
            <p className="font-bold text-xl mb-2">Gratis</p>
            <p className="mb-4">Para desarrolladores que desean explorar la plataforma.</p>
            <ul className="space-y-2">
              <li>✅ Hasta 3 diagramas al mes</li>
              <li>✅ Acceso a herramientas básicas de diseño</li>
              <li>✅ Exportación en formato PNG</li>
              <li>❌ Sin almacenamiento prolongado</li>
              <li>❌ Sin soporte prioritario</li>
            </ul>
          </DocCard>
          
          <DocCard title="Plan Profesional" className="border-l-4 border-l-success">
            <p className="font-bold text-xl mb-2">$19.99/mes</p>
            <p className="mb-4">Para desarrolladores profesionales y freelancers.</p>
            <ul className="space-y-2">
              <li>✅ Diagramas ilimitados</li>
              <li>✅ Todas las herramientas de diseño</li>
              <li>✅ Exportación en múltiples formatos</li>
              <li>✅ Almacenamiento por 1 año</li>
              <li>✅ Soporte por email</li>
              <li>✅ Sin marca de agua</li>
            </ul>
          </DocCard>
          
          <DocCard title="Plan Empresarial" className="border-l-4 border-l-warning">
            <p className="font-bold text-xl mb-2">$49.99/mes</p>
            <p className="mb-4">Para equipos y empresas.</p>
            <ul className="space-y-2">
              <li>✅ Todo lo del plan Profesional</li>
              <li>✅ Hasta 5 usuarios</li>
              <li>✅ Colaboración en tiempo real</li>
              <li>✅ Almacenamiento ilimitado</li>
              <li>✅ Soporte prioritario 24/7</li>
              <li>✅ Integración con herramientas corporativas</li>
            </ul>
          </DocCard>
        </div>
        
        <DocAlert type="info" title="Planes personalizados">
          <p>Para equipos más grandes o con necesidades específicas, ofrecemos planes personalizados. Contacta a nuestro equipo de ventas en <a href="mailto:kodeandoando2023@gmail.com" className="link">kodeandoando2023@gmail.com</a> para más información.</p>
        </DocAlert>
      </DocSubsection>
      
      <DocSubsection title="Gestión de Suscripciones">
        <p>Administrar tu suscripción es sencillo:</p>
        <ol>
          <li>Inicia sesión en tu cuenta</li>
          <li>Ve a &quot;Mi Perfil&quot; en la esquina superior derecha</li>
          <li>Selecciona &quot;Gestionar Suscripción&quot;</li>
          <li>Desde allí puedes actualizar, cambiar o cancelar tu plan</li>
        </ol>
        
        <DocAlert type="warning" title="Política de cancelación">
          <p>Puedes cancelar tu suscripción en cualquier momento. Al cancelar, mantendrás el acceso hasta el final del período de facturación actual, sin reembolsos por tiempo no utilizado.</p>
        </DocAlert>
      </DocSubsection>
      
      <DocSubsection title="Métodos de Pago">
        <p>Aceptamos los siguientes métodos de pago:</p>
        <ul>
          <li>Tarjetas de crédito/débito (Visa, Mastercard, American Express)</li>
          <li>PayPal</li>
          <li>Transferencia bancaria (solo para planes empresariales)</li>
        </ul>
        <p>Todas las transacciones son procesadas de forma segura a través de proveedores de pago certificados.</p>
      </DocSubsection>
    </DocSection>
  );
}
