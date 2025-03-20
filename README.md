# SysDiagramAI

![SysDiagramAI Logo](public/sysDiagramLogo.png)

## Descripción

SysDiagramAI es una aplicación web diseñada para desarrolladores que necesitan crear diseños de sistemas de software de manera eficiente. Los usuarios ingresan requerimientos de software a través de un formulario o texto libre, y la aplicación utiliza la API de OpenAI para generar automáticamente:

- Diagramas de diseño de sistemas (arquitectura, base de datos, APIs)
- Explicaciones detalladas de cada componente
- Recomendaciones de herramientas/tecnologías con justificaciones

La interfaz es simple y enfocada en usabilidad: un formulario de entrada, un panel de resultados con diagramas descargables (en texto o imagen) y explicaciones.

## Características Principales

- **Generación Automática de Diagramas**: Convierte requerimientos en diagramas de arquitectura y base de datos
- **Explicaciones Detalladas**: Cada componente viene con una explicación clara de su propósito y funcionamiento
- **Autenticación Segura**: Registro e inicio de sesión con email/contraseña o proveedores OAuth (Google, GitHub)
- **Modelo Freemium**: 3 diseños gratuitos por mes, con suscripción para acceso ilimitado
- **Descarga de Resultados**: Exportación de diagramas y explicaciones en formato Markdown o PDF
- **Historial de Diseños**: Acceso a todos los diseños generados anteriormente

## Tecnologías Utilizadas

- **Frontend y Backend**: [Next.js](https://nextjs.org/) con TypeScript
- **Estilizado**: [TailwindCSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **Base de Datos**: [MongoDB](https://www.mongodb.com/)
- **Autenticación**: [Auth.js](https://authjs.dev/)
- **Pagos**: [Stripe](https://stripe.com/)
- **IA**: [OpenAI API](https://openai.com/)

## Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/yourusername/sysdiagramai.git
   cd sysdiagramai
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
   ```
   # MongoDB
   MONGODB_URI=your_mongodb_uri

   # Auth.js
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**:
   [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
sysdiagramai/
├── app/                  # Rutas y componentes de la aplicación
│   ├── api/              # API routes para backend
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Contextos de React (Auth, Subscription)
│   └── pages/            # Páginas principales
├── libs/                 # Utilidades y servicios
│   ├── models/           # Modelos de datos
│   └── services/         # Servicios (MongoDB, OpenAI, Stripe)
├── public/               # Archivos estáticos
└── docs/                 # Documentación del proyecto
```

## Uso de la Aplicación

1. **Registro e Inicio de Sesión**:
   - Regístrate con email/contraseña o con tu cuenta de Google/GitHub
   - Inicia sesión para acceder a todas las funcionalidades

2. **Crear un Nuevo Diseño**:
   - Completa el formulario con los requerimientos de tu sistema
   - Especifica detalles como escala, tipo de aplicación y requisitos no funcionales
   - Haz clic en "Generar Diseño"

3. **Ver y Descargar Resultados**:
   - Explora el diagrama de arquitectura y el esquema de base de datos generados
   - Lee las explicaciones detalladas de cada componente
   - Descarga los resultados en formato Markdown o PDF

4. **Gestionar Suscripción**:
   - Monitorea tu uso (diseños generados/límite)
   - Actualiza a plan premium para acceso ilimitado
   - Gestiona tu suscripción desde el panel de usuario

## Modelo de Suscripción

- **Plan Gratuito**: 3 diseños por mes
- **Plan Premium**: Diseños ilimitados por $10/mes
- **Gestión de Pagos**: Segura a través de Stripe

## Contacto

Para cualquier consulta o soporte, contáctanos en [kodeandoando2023@gmail.com](mailto:kodeandoando2023@gmail.com).

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ por el equipo de SysDiagramAI
