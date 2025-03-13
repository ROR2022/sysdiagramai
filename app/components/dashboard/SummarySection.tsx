'use client';

import Link from "next/link";

interface Diagram {
  id: string;
  title: string;
  date: string;
  status: string;
}

interface SummarySectionProps {
  diagrams: Diagram[];
}

export default function SummarySection({ diagrams }: SummarySectionProps) {
  return (
    <div className="card text-base-content bg-base-100 shadow-md h-full">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4">Resumen</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-200 rounded-box p-4">
            <div className="stat-title text-base-content/70">Diagramas</div>
            <div className="stat-value text-primary">12</div>
            <div className="stat-desc text-base-content/60">↗︎ 2 (30%)</div>
          </div>
          
          <div className="stat bg-base-200 rounded-box p-4">
            <div className="stat-title text-base-content/70">Proyectos</div>
            <div className="stat-value text-secondary">4</div>
            <div className="stat-desc text-base-content/60">↗︎ 1 (25%)</div>
          </div>
          
          <div className="stat bg-base-200 rounded-box p-4">
            <div className="stat-title text-base-content/70">Colaboradores</div>
            <div className="stat-value text-accent">7</div>
            <div className="stat-desc text-base-content/60">↗︎ 3 (42%)</div>
          </div>
        </div>
        
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
              {diagrams.map((diagram) => (
                <tr key={diagram.id}>
                  <td>{diagram.title}</td>
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
        
        <div className="card-actions justify-end mt-4">
          <Link href="/dashboard/diagrams" className="btn btn-sm btn-ghost">
            Ver todos →
          </Link>
        </div>
      </div>
    </div>
  );
}
