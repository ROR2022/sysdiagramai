import DocSection from '../DocSection';
import DocSubsection from '../DocSubsection';
import DocCard from '../DocCard';
import DocAlert from '../DocAlert';

export default function RequirementsFormSection() {
  return (
    <DocSection id="requirements-form" title="Uso del Formulario de Requerimientos">
      <p>El formulario de requerimientos es la interfaz principal para comunicar a SysDiagramAI lo que necesitas. Cuanto más detallada sea tu descripción, mejores serán los resultados.</p>
      
      <DocSubsection title="Requerimientos Funcionales">
        <p>Los requerimientos funcionales describen lo que tu sistema debe hacer. Incluye:</p>
        <ul>
          <li>Propósito principal de la aplicación</li>
          <li>Funcionalidades clave que debe soportar</li>
          <li>Tipos de usuarios y sus interacciones</li>
          <li>Flujos de datos y procesos importantes</li>
        </ul>
        
        <DocCard title="Ejemplo de Requerimiento Funcional">
          <p className="italic">"Una aplicación de comercio electrónico que permita a los usuarios registrarse, navegar por catálogos de productos, añadir items al carrito, completar pagos y hacer seguimiento de pedidos. Los administradores deben poder gestionar inventario y ver estadísticas de ventas."</p>
        </DocCard>
      </DocSubsection>
      
      <DocSubsection title="Requerimientos No Funcionales">
        <p>Los requerimientos no funcionales definen características de calidad y restricciones. Especifica:</p>
        <ul>
          <li>Escala esperada (número de usuarios, volumen de datos)</li>
          <li>Tiempo de respuesta y rendimiento</li>
          <li>Disponibilidad y tolerancia a fallos</li>
          <li>Seguridad y conformidad</li>
          <li>Limitaciones tecnológicas o preferencias</li>
        </ul>
        
        <DocCard title="Ejemplo de Requerimiento No Funcional">
          <p className="italic">"El sistema debe soportar 100,000 usuarios concurrentes con un tiempo de respuesta menor a 200ms. Debe tener una disponibilidad del 99.9% y cumplir con los estándares PCI-DSS para manejo de pagos. Preferimos tecnologías basadas en la nube para facilitar el escalado."</p>
        </DocCard>
      </DocSubsection>
      
      <DocSubsection title="Modo Texto Libre">
        <p>Si prefieres un enfoque más conversacional, puedes utilizar el campo de texto libre para describir tu sistema completo. Para obtener mejores resultados:</p>
        <ul>
          <li>Sé específico sobre el dominio de tu aplicación</li>
          <li>Incluye tanto funcionalidades como requisitos de escala</li>
          <li>Menciona tecnologías específicas si tienes preferencias</li>
          <li>Describe situaciones críticas que tu sistema debe manejar</li>
        </ul>
        
        <DocAlert type="warning" title="Importante">
          <p>Evita descripciones demasiado vagas como "una app escalable y rápida". Cuantifica tus necesidades siempre que sea posible.</p>
        </DocAlert>
      </DocSubsection>
    </DocSection>
  );
}
