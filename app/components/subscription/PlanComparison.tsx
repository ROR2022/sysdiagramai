'use client';

interface Feature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  team: boolean | string;
}

export default function PlanComparison() {
  const features: Feature[] = [
    {
      name: 'Diagramas mensuales',
      free: '3',
      pro: '50',
      team: '1000',
    },
    {
      name: 'Exportación a Markdown',
      free: true,
      pro: true,
      team: true,
    },
    {
      name: 'Exportación a PDF',
      free: false,
      pro: true,
      team: true,
    },
    {
      name: 'Exportación a PNG',
      free: false,
      pro: true,
      team: true,
    },
    {
      name: 'Exportación a SVG',
      free: false,  
      pro: true,
      team: true,
    },
    {
      name: 'Historial de versiones',
      free: false,
      pro: true,
      team: true,
    },
    {
      name: 'Compartir diagramas',
      free: false,
      pro: true,
      team: true,
    },
    {
      name: 'Colaboración en tiempo real',
      free: false,
      pro: false,
      team: true,
    },
    {
      name: 'Usuarios múltiples',
      free: false,
      pro: false,
      team: '5 usuarios',
    },
    {
      name: 'Soporte prioritario',
      free: false,
      pro: false,
      team: true,
    },
    {
      name: 'API de integración',
      free: false,
      pro: false,
      team: true,
    },
  ];

  // Renderizar el valor de una característica
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'string') {
      return <span className="font-medium">{value}</span>;
    }
    
    return value ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-success mx-auto"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-base-content/30 mx-auto"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th className="bg-base-200">Características</th>
            <th className="bg-base-200 text-center">Plan Gratuito</th>
            <th className="bg-base-200 text-center">Plan Profesional</th>
            <th className="bg-base-200 text-center">Plan Equipo</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-base-100' : 'bg-base-200/50'}>
              <td className="font-medium">{feature.name}</td>
              <td className="text-center">{renderFeatureValue(feature.free)}</td>
              <td className="text-center">{renderFeatureValue(feature.pro)}</td>
              <td className="text-center">{renderFeatureValue(feature.team)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 