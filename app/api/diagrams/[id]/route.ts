import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const id = params.id;
    
    // En una implementación real, buscarías en la base de datos
    // Por ahora, generamos datos estáticos dependiendo del ID
    
    // Simulando un poco de procesamiento
    await new Promise(resolve => setTimeout(resolve, 500));

    // Datos simulados - esto sería obtenido de la base de datos
    const diagram = {
      id,
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
      userId: session.user?.id || 'user_123',
    };
    
    return NextResponse.json(diagram);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al recuperar el diagrama' },
      { status: 500 }
    );
  }
} 