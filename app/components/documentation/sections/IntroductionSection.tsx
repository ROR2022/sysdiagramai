import DocSection from '../DocSection';
import DocSubsection from '../DocSubsection';
import DocCard from '../DocCard';

export default function IntroductionSection() {
  return (
    <DocSection id="introduction" title="Introducción a SysDiagramAI">
      <DocCard title="Concepto y Visión">
        <p>SysDiagramAI es una web app diseñada para desarrolladores que necesitan crear diseños de sistemas de software de manera eficiente. La aplicación utiliza la API de Open AI para procesar requerimientos ingresados por el usuario y generar automáticamente diagramas de diseño de sistemas, explicaciones detalladas y recomendaciones tecnológicas.</p>
      </DocCard>
      
      <DocSubsection title="Problema que Resuelve">
        <p>El diseño de sistemas es una fase crítica en el desarrollo de software que tradicionalmente consume mucho tiempo y requiere experiencia. SysDiagramAI automatiza esta tarea, permitiendo:</p>
        <ul>
          <li>Reducir significativamente el tiempo dedicado a la fase de diseño</li>
          <li>Generar diseños consistentes basados en mejores prácticas</li>
          <li>Explorar diferentes arquitecturas rápidamente</li>
          <li>Facilitar la comunicación del diseño con equipos y stakeholders</li>
        </ul>
      </DocSubsection>
      
      <DocSubsection title="Beneficios para Desarrolladores">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <DocCard title="Agilidad">
            <p>Genere diagramas de arquitectura y esquemas de bases de datos en segundos, no en horas o días.</p>
          </DocCard>
          <DocCard title="Consistencia">
            <p>Obtenga diseños estructurados siguiendo patrones probados de arquitectura de software.</p>
          </DocCard>
          <DocCard title="Buenas Prácticas">
            <p>Aprenda de las explicaciones detalladas que acompañan a cada componente del sistema.</p>
          </DocCard>
          <DocCard title="Flexibilidad">
            <p>Itere sobre sus requerimientos para explorar diferentes enfoques de diseño.</p>
          </DocCard>
        </div>
      </DocSubsection>
    </DocSection>
  );
}
