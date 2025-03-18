import DocSection from '../DocSection';
import DocSubsection from '../DocSubsection';
import DocAlert from '../DocAlert';

export default function GettingStartedSection() {
  return (
    <DocSection id="getting-started" title="Primeros Pasos">
      <DocSubsection title="Registro y Autenticación">
        <p>Para comenzar a usar SysDiagramAI, primero necesitas crear una cuenta:</p>
        <ol>
          <li>Haz clic en el botón &quot;Iniciar Sesión&quot; en la página principal</li>
          <li>Elige entre registrarte con email/contraseña o usar tus cuentas existentes de Google o GitHub</li>
          <li>Completa el proceso de registro y verifica tu email si es necesario</li>
          <li>¡Listo! Ya puedes acceder a todas las funcionalidades de SysDiagramAI</li>
        </ol>
        
        <DocAlert type="info" title="Consejo">
          <p>Recomendamos utilizar OAuth (Google/GitHub) para un inicio de sesión más rápido y seguro.</p>
        </DocAlert>
      </DocSubsection>
      
      <DocSubsection title="Tour por la Interfaz">
        <p>La interfaz de SysDiagramAI está diseñada para ser intuitiva y fácil de usar:</p>
        <ul>
          <li><strong>Dashboard:</strong> Aquí puedes ver tus diseños recientes y crear nuevos</li>
          <li><strong>Formulario de Requerimientos:</strong> Donde ingresas las especificaciones de tu sistema</li>
          <li><strong>Panel de Resultados:</strong> Muestra los diagramas generados y explicaciones</li>
          <li><strong>Perfil de Usuario:</strong> Gestiona tu cuenta y suscripción</li>
        </ul>
      </DocSubsection>
      
      <DocSubsection title="Tu Primer Diagrama">
        <p>Sigue estos pasos para generar tu primer diagrama de sistema:</p>
        <div className="steps steps-vertical">
          <div className="step step-primary">
            <div className="step-content mt-4">
              <h4>Inicia sesión en tu cuenta</h4>
              <p>Accede con tus credenciales desde la página principal</p>
            </div>
          </div>
          <div className="step step-primary">
            <div className="step-content mt-4">
              <h4>Haz clic en &quot;Nuevo Diagrama&quot;</h4>
              <p>Encontrarás este botón en tu dashboard</p>
            </div>
          </div>
          <div className="step step-primary">
            <div className="step-content mt-4">
              <h4>Describe tu sistema</h4>
              <p>Completa el formulario con los requerimientos de tu aplicación</p>
            </div>
          </div>
          <div className="step step-primary">
            <div className="step-content mt-4">
              <h4>Haz clic en &quot;Generar&quot;</h4>
              <p>Espera unos segundos mientras procesamos tu solicitud</p>
            </div>
          </div>
          <div className="step step-primary">
            <div className="step-content mt-4">
              <h4>¡Explora tus resultados!</h4>
              <p>Visualiza, descarga o comparte tu diagrama generado</p>
            </div>
          </div>
        </div>
      </DocSubsection>
    </DocSection>
  );
}
