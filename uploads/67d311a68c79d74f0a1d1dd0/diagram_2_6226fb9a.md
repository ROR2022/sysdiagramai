2. ARQUITECTURA DE ALTO NIVEL

Los componentes principales del sistema son el navegador del usuario final, el servidor de aplicaciones, el servidor de la base de datos y la base de datos. Los patrones de comunicación implicarán principalmente solicitudes HTTP desde el navegador al servidor de la aplicación y consultas SQL desde el servidor de la aplicación a la base de datos.

DIAGRAMA DE ARQUITECTURA
```
graph LR
A[Navegador del usuario] -- Solicitudes HTTP --> B((Servidor de aplicación))
B -- Consultas SQL --> C((Base de datos))
B -- Respuestas HTTP --> A
```

Esta arquitectura muestra cómo se comunicarán los componentos clave del sistema, con solicitudes HTTP que van desde el navegador del usuario hasta el servidor de aplicación, y consultas SQL que van desde dicho servidor hasta la base de datos.