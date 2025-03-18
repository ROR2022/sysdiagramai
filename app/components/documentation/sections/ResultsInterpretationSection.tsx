import DocSection from '../DocSection';
import DocSubsection from '../DocSubsection';
import DocCard from '../DocCard';
import DocAlert from '../DocAlert';

export default function ResultsInterpretationSection() {
  return (
    <DocSection id="results-interpretation" title="Interpretación de Resultados">
      <p>Una vez que SysDiagramAI procese tus requerimientos, generará un conjunto de diagramas y explicaciones. Comprender estos resultados te ayudará a implementar efectivamente el diseño propuesto.</p>
      
      <DocSubsection title="Diagramas de Arquitectura">
        <p>Los diagramas de arquitectura muestran la estructura de alto nivel de tu sistema. Incluyen:</p>
        <ul>
          <li>Componentes principales (frontend, backend, bases de datos)</li>
          <li>Patrones de comunicación entre componentes</li>
          <li>Servicios externos e integraciones</li>
          <li>Flujo de datos a través del sistema</li>
        </ul>
        
        <DocCard title="Cómo leer un diagrama de arquitectura">
          <ul>
            <li>Las cajas representan componentes o servicios</li>
            <li>Las flechas indican dirección de comunicación</li>
            <li>Los diferentes colores/estilos pueden indicar diferentes tipos de componentes</li>
            <li>Busca patrones comunes como arquitecturas en capas, microservicios o serverless</li>
          </ul>
        </DocCard>
      </DocSubsection>
      
      <DocSubsection title="Esquemas de Base de Datos">
        <p>Los esquemas de base de datos describen cómo se organizarán tus datos. Observa:</p>
        <ul>
          <li>Entidades principales (tablas/colecciones)</li>
          <li>Atributos (campos) de cada entidad</li>
          <li>Relaciones entre entidades</li>
          <li>Índices y claves</li>
        </ul>
        
        <DocAlert type="info" title="Consejo">
          <p>SysDiagramAI puede proponer tanto esquemas SQL (relacionales) como NoSQL, dependiendo de tus requisitos. Revisa las justificaciones para entender por qué se eligió cada enfoque.</p>
        </DocAlert>
      </DocSubsection>
      
      <DocSubsection title="Explicaciones y Recomendaciones">
        <p>Junto con los diagramas, recibirás:</p>
        <ul>
          <li>Justificación para cada componente arquitectónico</li>
          <li>Explicación de por qué se eligieron ciertas tecnologías</li>
          <li>Consideraciones sobre escalabilidad y rendimiento</li>
          <li>Recomendaciones de implementación</li>
          <li>Posibles riesgos y mitigaciones</li>
        </ul>
      </DocSubsection>
    </DocSection>
  );
}
