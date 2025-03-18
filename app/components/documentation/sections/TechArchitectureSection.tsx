import DocSection from '../DocSection';
import DocSubsection from '../DocSubsection';
import DocCard from '../DocCard';

export default function TechArchitectureSection() {
  return (
    <DocSection id="tech-architecture" title="Tecnologías y Arquitectura">
      <p>SysDiagramAI se construye sobre tecnologías modernas y robustas que permiten ofrecer una experiencia ágil y de alta calidad para el diseño de sistemas.</p>
      
      <DocSubsection title="Stack Tecnológico">
        <p>Nuestro stack tecnológico ha sido cuidadosamente seleccionado para garantizar un desarrollo eficiente y una experiencia de usuario óptima:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <DocCard title="Frontend">
            <ul>
              <li><strong>Next.js:</strong> Framework de React para renderizado del lado del servidor</li>
              <li><strong>TailwindCSS:</strong> Framework de utilidades CSS para estilos consistentes</li>
              <li><strong>DaisyUI:</strong> Componentes basados en Tailwind para una UI elegante</li>
              <li><strong>TypeScript:</strong> Para añadir tipado estático y mejorar la robustez del código</li>
            </ul>
          </DocCard>
          
          <DocCard title="Backend">
            <ul>
              <li><strong>Next.js API Routes:</strong> Endpoints serverless para la lógica de negocio</li>
              <li><strong>MongoDB:</strong> Base de datos NoSQL para almacenamiento de usuarios y diagramas</li>
              <li><strong>OpenAI API:</strong> Para generar diagramas y explicaciones basadas en IA</li>
              <li><strong>NextAuth.js:</strong> Autenticación segura y sencilla</li>
            </ul>
          </DocCard>
        </div>
      </DocSubsection>
      
      <DocSubsection title="Arquitectura de la Aplicación">
        <p>SysDiagramAI sigue una arquitectura moderna de aplicación web:</p>
        
        <DocCard>
          <ul>
            <li><strong>Cliente:</strong> Interfaz de usuario interactiva desarrollada con Next.js y React</li>
            <li><strong>API:</strong> Capa de servicios implementada con Next.js API Routes</li>
            <li><strong>Persistencia:</strong> MongoDB para el almacenamiento de datos</li>
            <li><strong>Servicios Externos:</strong> Integración con OpenAI para la generación de contenido</li>
          </ul>
        </DocCard>
        
        <p className="mt-4">Esta arquitectura nos permite:</p>
        <ul>
          <li>Proporcionar tiempos de respuesta rápidos gracias al renderizado del lado del servidor</li>
          <li>Escalar eficientemente según la demanda</li>
          <li>Mantener bajos costos operativos mediante servicios serverless</li>
          <li>Ofrecer una experiencia de usuario fluida y responsiva</li>
        </ul>
      </DocSubsection>
      
      <DocSubsection title="Seguridad y Protección de Datos">
        <p>La seguridad es una prioridad principal en SysDiagramAI:</p>
        <ul>
          <li>Autenticación segura a través de NextAuth.js</li>
          <li>Conexiones HTTPS para toda la comunicación</li>
          <li>Almacenamiento seguro de credenciales</li>
          <li>Validación de entradas para prevenir ataques</li>
          <li>Aislamiento de datos entre usuarios</li>
        </ul>
        
        <p>Para cualquier consulta relacionada con la seguridad o la protección de datos, no dudes en contactarnos en <strong>kodeandoando2023@gmail.com</strong>.</p>
      </DocSubsection>
    </DocSection>
  );
}
