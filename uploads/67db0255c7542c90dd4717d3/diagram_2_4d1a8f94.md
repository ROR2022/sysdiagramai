2. ARQUITECTURA DE ALTO NIVEL

   - Los componentes principales del sistema son la Interfaz de Usuario, el Servidor de Aplicaciones que contiene la lógica del negocio y el Sistema de Base de Datos.

   - Los usuarios interactúan con la Interfaz de Usuario; las acciones del usuario son procesadas por el Servidor de Aplicaciones que luego interactúa con el Sistema de Base de Datos para obtener, actualizar o almacenar datos.

   - Diagrama de Arquitectura General (Usa Mermaid):

```
graph LR
A[Usuario Empleado / Gerente] --> B{Interfaz de Usuario}
B -- Peticiones --> D[Servidor de Aplicaciones]
D -- Consultas/Actualizaciones --> E{Sistema de Base de Datos}
D -- Respuestas --> B
B -- Respuestas --> A
```
  
   - En este diagrama se ilustra cómo los usuarios interactúan con la interfaz de usuario, la cual genera peticiones al servidor de aplicaciones. Este servidor interactúa con el sistema de base de datos para procesar estas peticiones y entrega respuestas de vuelta a la interfaz de usuario, que finalmente las presenta al usuario.