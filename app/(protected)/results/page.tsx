'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Tipo para los datos del diseño
interface DiagramData {
  id: string;
  projectName: string;
  systemType: string;
  expectedUsers: string;
  architectureDiagram: string;
  databaseDiagram: string;
  explanation: string;
  createdAt: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const designId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<DiagramData | null>(null);
  const [activeTab, setActiveTab] = useState('architecture');
  
  useEffect(() => {
    if (!designId) {
      router.push('/dashboard');
      return;
    }
    
    // Simular la carga de datos - En una implementación real harías un fetch a tu API
    setTimeout(() => {
      // Datos de muestra - reemplazar con un fetch real a tu API
      setDesign({
        id: designId || '123',
        projectName: 'Sistema de Reservas Online',
        systemType: 'web',
        expectedUsers: '1000',
        architectureDiagram: `\`\`\`mermaid
graph TD
    Client[Cliente Web] --> |HTTPS| LB[Load Balancer]
    LB --> API[API Gateway]
    API --> Auth[Servicio de Autenticación]
    API --> Booking[Servicio de Reservas]
    API --> Payment[Servicio de Pagos]
    API --> Notification[Servicio de Notificaciones]
    Booking --> BookingDB[(Base de Datos de Reservas)]
    Auth --> UserDB[(Base de Datos de Usuarios)]
    Payment --> PaymentDB[(Base de Datos de Pagos)]
    Payment --> |API| ExternalPayment[Pasarela de Pago Externa]
    Notification --> |SMTP| EmailService[Servicio de Email]
    Notification --> |SMS API| SMSService[Servicio de SMS]
\`\`\``,
        databaseDiagram: `\`\`\`mermaid
erDiagram
    USERS {
        string id PK
        string email
        string password_hash
        string name
        string role
        date created_at
    }
    
    BOOKINGS {
        string id PK
        string user_id FK
        date date_from
        date date_to
        float total_price
        string status
        date created_at
    }
    
    PAYMENTS {
        string id PK
        string booking_id FK
        float amount
        string payment_method
        string status
        date created_at
    }
    
    NOTIFICATIONS {
        string id PK
        string user_id FK
        string related_id
        string type
        string content
        bool read
        date created_at
    }
    
    USERS ||--o{ BOOKINGS : "realiza"
    BOOKINGS ||--o{ PAYMENTS : "tiene"
    USERS ||--o{ NOTIFICATIONS : "recibe"
\`\`\``,
        explanation: `
## Explicación del Diseño del Sistema

### Arquitectura del Sistema
El sistema sigue una arquitectura basada en microservicios para asegurar escalabilidad y mantenibilidad:

1. **Cliente Web**: Interfaz de usuario desarrollada en React con Next.js
2. **Load Balancer**: Distribuye el tráfico entre múltiples instancias para garantizar alta disponibilidad
3. **API Gateway**: Punto de entrada único que enruta las solicitudes a los servicios apropiados
4. **Microservicios**:
   - **Servicio de Autenticación**: Gestiona registro, inicio de sesión y tokens JWT
   - **Servicio de Reservas**: Maneja la creación y gestión de reservas
   - **Servicio de Pagos**: Procesa pagos y se conecta con proveedores externos
   - **Servicio de Notificaciones**: Envía notificaciones por email y SMS

### Modelo de Base de Datos
La base de datos está diseñada para soportar hasta 1000 usuarios concurrentes:

1. **Users**: Almacena información de los usuarios registrados
2. **Bookings**: Registra las reservas realizadas por los usuarios
3. **Payments**: Guarda información sobre los pagos asociados a las reservas
4. **Notifications**: Mantiene un registro de las notificaciones enviadas a los usuarios

### Recomendaciones Técnicas
- **Frontend**: React + Next.js con TailwindCSS para la interfaz de usuario
- **Backend**: Node.js con Express para los microservicios
- **Base de Datos**: MongoDB para flexibilidad en el esquema
- **Autenticación**: JWT con refresh tokens
- **Despliegue**: Contenedores Docker orquestados con Kubernetes
- **Monitoreo**: ELK Stack para logs y Prometheus para métricas

Esta arquitectura permite escalar horizontalmente cada servicio según la demanda y facilita futuras extensiones del sistema.
`,
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
    }, 1500);
  }, [designId, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!design) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Diagrama no encontrado</h1>
          <p className="text-gray-600 mb-4">
            Lo sentimos, no pudimos encontrar el diagrama solicitado.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{design.projectName}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {design.systemType === 'web' ? 'Aplicación Web' : 
                   design.systemType === 'mobile' ? 'Aplicación Móvil' : 
                   design.systemType === 'desktop' ? 'Aplicación de Escritorio' :
                   design.systemType === 'api' ? 'API/Microservicios' : 
                   'Sistema de Base de Datos'}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {design.expectedUsers === '100' ? 'Menos de 100 usuarios' :
                   design.expectedUsers === '1000' ? '100-1,000 usuarios' :
                   design.expectedUsers === '10000' ? '1,000-10,000 usuarios' :
                   'Más de 10,000 usuarios'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/form')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Nuevo Diagrama
              </button>
              <button
                onClick={() => {/* Lógica para descargar como PDF */}}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Descargar
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'architecture' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Diagrama de Arquitectura
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'database' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Diagrama de Base de Datos
            </button>
            <button
              onClick={() => setActiveTab('explanation')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'explanation' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Explicación
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'architecture' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Diagrama de Arquitectura</h2>
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {design.architectureDiagram}
                </pre>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                Este diagrama muestra la arquitectura de sistema propuesta basada en los requerimientos ingresados.
              </p>
            </div>
          )}
          
          {activeTab === 'database' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Diagrama de Base de Datos</h2>
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {design.databaseDiagram}
                </pre>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                Este diagrama muestra la estructura de la base de datos recomendada para el sistema.
              </p>
            </div>
          )}
          
          {activeTab === 'explanation' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Explicación del Diseño</h2>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: design.explanation.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 text-right">
          <p className="text-sm text-gray-500">
            Creado el {new Date(design.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
} 