'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface Diagram {
  id: string;
  title: string;
  date: string;
  status: string;
}

interface Project {
  id: string;
  name: string;
}

interface Collaborator {
  id: string;
  name: string;
}

interface Stats {
  diagramCount: number;
  diagramGrowth: number;
  diagramGrowthPercent: number;
  projectCount: number;
  projectGrowth: number;
  projectGrowthPercent: number;
  collaboratorCount: number;
  collaboratorGrowth: number;
  collaboratorGrowthPercent: number;
}

interface SummarySectionProps {
  diagrams: Diagram[];
  projects?: Project[];
  collaborators?: Collaborator[];
  isLoading?: boolean;
}

export default function SummarySection({ 
  diagrams, 
  projects = [],
  collaborators = [],
  isLoading = false
}: SummarySectionProps) {
  const [stats, setStats] = useState<Stats>({
    diagramCount: 0,
    diagramGrowth: 0,
    diagramGrowthPercent: 0,
    projectCount: 0,
    projectGrowth: 0,
    projectGrowthPercent: 0,
    collaboratorCount: 0,
    collaboratorGrowth: 0,
    collaboratorGrowthPercent: 0
  });
  
  // Usar useRef para almacenar los valores calculados y evitar el bucle infinito
  const calculationsPerformedRef = useRef(false);

  // Calcular estadísticas cuando cambian los datos
  useEffect(() => {
    // Solo realizar el cálculo si no se ha hecho ya o si los datos han cambiado realmente
    if (!isLoading && !calculationsPerformedRef.current) {
      // Marcar que ya se han realizado los cálculos para evitar repeticiones
      calculationsPerformedRef.current = true;
      
      // Usar valores fijos para el crecimiento en lugar de números aleatorios
      // En un caso real, estos valores vendrían del backend
      const calculateGrowthFixed = (count: number) => {
        // Valores fijos para evitar re-renderizados infinitos
        const growth = count > 0 ? Math.max(1, Math.floor(count * 0.2)) : 0;
        const growthPercent = count > 0 ? Math.round((growth / count) * 100) : 0;
        return { growth, growthPercent };
      };

      const diagramStats = calculateGrowthFixed(diagrams.length);
      const projectStats = calculateGrowthFixed(projects.length);
      const collaboratorStats = calculateGrowthFixed(collaborators.length);

      setStats({
        diagramCount: diagrams.length,
        diagramGrowth: diagramStats.growth,
        diagramGrowthPercent: diagramStats.growthPercent,
        projectCount: projects.length,
        projectGrowth: projectStats.growth,
        projectGrowthPercent: projectStats.growthPercent,
        collaboratorCount: collaborators.length,
        collaboratorGrowth: collaboratorStats.growth,
        collaboratorGrowthPercent: collaboratorStats.growthPercent
      });
    }
  }, [diagrams, projects, collaborators, isLoading]);

  // Restablecer la marca de cálculos cuando cambien las dependencias reales
  useEffect(() => {
    calculationsPerformedRef.current = false;
  }, [diagrams.length, projects.length, collaborators.length, isLoading]);

  // Funciones de renderizado condicional
  const renderSkeletonStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="stat bg-base-200 rounded-box p-4">
          <div className="h-4 bg-base-300 rounded w-20 mb-2"></div>
          <div className="h-8 bg-base-300 rounded w-16 mb-2"></div>
          <div className="h-3 bg-base-300 rounded w-24"></div>
        </div>
      ))}
    </div>
  );

  const renderSkeletonTable = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-base-200 rounded mb-2"></div>
      {[1, 2, 3].map(i => (
        <div key={i} className="h-12 bg-base-200 rounded-md mb-2"></div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-6">
      <div className="text-5xl mb-3 opacity-20">📊</div>
      <h3 className="font-semibold text-lg mb-2">No hay datos para mostrar</h3>
      <p className="text-base-content/70 mb-4">Comienza creando tu primer diagrama</p>
      <Link href="/dashboard/diagrams/new" className="btn btn-sm btn-primary">
        Crear diagrama
      </Link>
    </div>
  );

  if (isLoading) {
    return (
      <div className="card text-base-content bg-base-100 shadow-md h-full">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Resumen</h2>
          {renderSkeletonStats()}
          {renderSkeletonTable()}
        </div>
      </div>
    );
  }

  const hasData = diagrams.length > 0 || projects.length > 0 || collaborators.length > 0;

  return (
    <div className="card text-base-content bg-base-100 shadow-md h-full">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4">Resumen</h2>
        
        {hasData ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="stat bg-base-200 rounded-box p-4">
                <div className="stat-title text-base-content/70">Diagramas</div>
                <div className="stat-value text-primary">{stats.diagramCount}</div>
                {stats.diagramGrowth > 0 && (
                  <div className="stat-desc text-base-content/60">
                    ↗︎ {stats.diagramGrowth} ({stats.diagramGrowthPercent}%)
                  </div>
                )}
              </div>
              
              <div className="stat bg-base-200 rounded-box p-4">
                <div className="stat-title text-base-content/70">Proyectos</div>
                <div className="stat-value text-secondary">{stats.projectCount}</div>
                {stats.projectGrowth > 0 && (
                  <div className="stat-desc text-base-content/60">
                    ↗︎ {stats.projectGrowth} ({stats.projectGrowthPercent}%)
                  </div>
                )}
              </div>
              
              <div className="stat bg-base-200 rounded-box p-4">
                <div className="stat-title text-base-content/70">Colaboradores</div>
                <div className="stat-value text-accent">{stats.collaboratorCount}</div>
                {stats.collaboratorGrowth > 0 && (
                  <div className="stat-desc text-base-content/60">
                    ↗︎ {stats.collaboratorGrowth} ({stats.collaboratorGrowthPercent}%)
                  </div>
                )}
              </div>
            </div>
            
            {diagrams.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Diagrama</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagrams.slice(0, 5).map((diagram) => (
                      <tr key={diagram.id}>
                        <td className="max-w-[200px] truncate">{diagram.title}</td>
                        <td>{diagram.date}</td>
                        <td>
                          <span className={`badge ${diagram.status === 'completed' ? 'badge-success' : 'badge-warning'} badge-sm`}>
                            {diagram.status === 'completed' ? 'Completado' : 'Borrador'}
                          </span>
                        </td>
                        <td className="text-right">
                          <Link href={`/dashboard/diagrams/${diagram.id}`} className="btn btn-ghost btn-xs">
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 bg-base-200 rounded-box">
                <p className="text-base-content/70">Aún no tienes diagramas</p>
                <Link href="/dashboard/diagrams/new" className="btn btn-xs btn-primary mt-2">
                  Crear diagrama
                </Link>
              </div>
            )}
            
            <div className="card-actions justify-end mt-4">
              <Link href="/dashboard/requirements" className="btn btn-sm btn-ghost">
                Ver todos →
              </Link>
            </div>
          </>
        ) : renderEmptyState()}
      </div>
    </div>
  );
}
