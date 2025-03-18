import DocSection from '../DocSection';
import DocSubsection from '../DocSubsection';
import DocCard from '../DocCard';

export default function DesignFrameworkSection() {
  return (
    <DocSection id="design-framework" title="Framework de Diseño">
      <p>SysDiagramAI sigue un framework estructurado para el diseño de sistemas de software, garantizando que cada aspecto importante sea considerado y documentado adecuadamente.</p>
      
      <DocSubsection title="Entendimiento de Requerimientos">
        <p>El primer paso en cualquier diseño de sistema es comprender completamente los requerimientos:</p>
        <ul>
          <li>Identificación clara del problema a resolver</li>
          <li>Análisis de las necesidades de los usuarios y stakeholders</li>
          <li>Definición del alcance y limitaciones</li>
          <li>Establecimiento de métricas de éxito</li>
        </ul>
        
        <DocCard title="Métodos de Captura de Requerimientos">
          <p>SysDiagramAI te permite ingresar requerimientos a través de:</p>
          <ul>
            <li>Formularios estructurados con campos específicos</li>
            <li>Descripciones en lenguaje natural</li>
            <li>Historias de usuario y casos de uso</li>
          </ul>
        </DocCard>
      </DocSubsection>
      
      <DocSubsection title="Diseño de Arquitectura">
        <p>Una vez que los requerimientos están claros, SysDiagramAI procede al diseño de arquitectura:</p>
        <ul>
          <li>Selección del estilo arquitectónico apropiado (monolítico, microservicios, serverless, etc.)</li>
          <li>Definición de componentes principales y sus responsabilidades</li>
          <li>Establecimiento de patrones de comunicación</li>
          <li>Consideraciones de escalabilidad, disponibilidad y seguridad</li>
        </ul>
      </DocSubsection>
      
      <DocSubsection title="Diseño Detallado">
        <p>El diseño detallado profundiza en cada componente de la arquitectura:</p>
        <ul>
          <li>Estructura interna de cada módulo</li>
          <li>Interfaces y contratos entre componentes</li>
          <li>Modelos de datos y esquemas</li>
          <li>Algoritmos y lógica de negocio</li>
          <li>Manejo de errores y casos excepcionales</li>
        </ul>
        
        <DocCard title="Patrones de Diseño">
          <p>SysDiagramAI incorpora patrones de diseño probados en la industria:</p>
          <ul>
            <li>Patrones de creación (Factory, Singleton, etc.)</li>
            <li>Patrones estructurales (Adapter, Composite, etc.)</li>
            <li>Patrones de comportamiento (Observer, Strategy, etc.)</li>
            <li>Patrones arquitectónicos (MVC, CQRS, etc.)</li>
          </ul>
        </DocCard>
      </DocSubsection>
      
      <DocSubsection title="Validación y Verificación">
        <p>El diseño propuesto es evaluado contra los requerimientos originales:</p>
        <ul>
          <li>Trazabilidad de requerimientos a componentes</li>
          <li>Análisis de puntos de fallo potenciales</li>
          <li>Evaluación de rendimiento estimado</li>
          <li>Consideración de costos de implementación y mantenimiento</li>
        </ul>
      </DocSubsection>
    </DocSection>
  );
}
