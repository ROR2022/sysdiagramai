import DocSection from '../DocSection';
import DocSubsection from '../DocSubsection';
import DocCard from '../DocCard';
import DocAlert from '../DocAlert';
import Link from 'next/link';

export default function AdvancedResourcesSection() {
  return (
    <DocSection id="advanced-resources" title="Recursos Avanzados">
      <p>Esta sección ofrece recursos adicionales para usuarios que desean profundizar en la comprensión y utilización de SysDiagramAI.</p>
      
      <DocSubsection title="Casos de Estudio">
        <p>Explora cómo otras empresas y desarrolladores han utilizado SysDiagramAI para mejorar sus procesos de diseño:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
          <DocCard title="Fintech: Plataforma de Pagos">
            <p>Una startup fintech utilizó SysDiagramAI para diseñar su arquitectura de microservicios, reduciendo el tiempo de diseño en un 70%.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="#" className="btn btn-sm btn-outline btn-primary">Leer caso completo</Link>
            </div>
          </DocCard>
          
          <DocCard title="Salud: Sistema de Gestión Hospitalaria">
            <p>Un equipo de desarrollo en el sector salud utilizó nuestra plataforma para visualizar flujos complejos de datos entre sistemas departamentales.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="#" className="btn btn-sm btn-outline btn-primary">Leer caso completo</Link>
            </div>
          </DocCard>
        </div>
      </DocSubsection>
      
      <DocSubsection title="API y Extensiones">
        <p>Para usuarios avanzados, ofrecemos opciones de integración con otras herramientas:</p>
        
        <DocAlert type="info" title="Documentación de API">
          <p>Nuestra API RESTful permite integrar la generación de diagramas en tus propios flujos de trabajo y herramientas. La documentación completa está disponible <Link href="#" className="link">aquí</Link>.</p>
        </DocAlert>
        
        <div className="my-6">
          <p>Ejemplos de uso de la API:</p>
          <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">
              {`// Ejemplo de solicitud de diagrama con la API
fetch('https://api.sysdiagramai.com/v1/diagrams', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TU_API_KEY'
  },
  body: JSON.stringify({
    requirements: "Sistema de comercio electrónico con carrito de compras",
    type: "architecture",
    format: "png"
  })
})`}
            </code>
          </pre>
        </div>
        
        <div className="my-6">
          <p>Extensiones disponibles:</p>
          <ul>
            <li>
              <strong>Plugin para VS Code:</strong> Genera diagramas directamente desde tu IDE
              <div className="mt-2">
                <Link href="#" className="btn btn-xs btn-outline">Descargar</Link>
              </div>
            </li>
            <li className="mt-4">
              <strong>Integración con Jira:</strong> Añade diagramas a tus historias de usuario
              <div className="mt-2">
                <Link href="#" className="btn btn-xs btn-outline">Marketplace de Atlassian</Link>
              </div>
            </li>
          </ul>
        </div>
      </DocSubsection>
      
      <DocSubsection title="Guías Avanzadas">
        <p>Profundiza en técnicas específicas:</p>
        
        <div className="my-6">
          <h4 className="font-bold">Webinars Grabados</h4>
          <ul>
            <li>
              <Link href="#" className="link">Diseñando Arquitecturas Escalables con SysDiagramAI</Link>
            </li>
            <li>
              <Link href="#" className="link">Optimización de Microservicios: Del Concepto al Diagrama</Link>
            </li>
            <li>
              <Link href="#" className="link">Patrones de Diseño Emergentes en Arquitectura de Software</Link>
            </li>
          </ul>
        </div>
        
        <DocAlert type="warning" title="Próximo webinar">
          <p>No te pierdas nuestro próximo webinar: &quot;De los Requerimientos al Diagrama: Mejores Prácticas&quot; - <Link href="#" className="link">Regístrate aquí</Link> para el evento del 15 de diciembre. El registro es gratuito pero los cupos son limitados.</p>
        </DocAlert>
      </DocSubsection>
    </DocSection>
  );
}
