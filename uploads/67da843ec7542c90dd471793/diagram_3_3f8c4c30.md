4. TRADE-OFFS Y ALTERNATIVAS

Justificación de decisiones arquitectónicas:

Elegimos una arquitectura de microservicios porque facilita la modularidad, la escalabilidad y la gestión del ciclo de vida de cada componente individual. Esto es beneficioso para un sistema de comercio electrónico que puede requerir cambios y escalabilidad en componentes específicos, como inventario y procesamiento de pagos.

Alternativas consideradas:

Una alternativa sería una arquitectura monolítica, pero esta opción puede resultar menos flexible y escalable para este tipo de aplicación.

Estrategias de resiliencia: 

El sistema contará con un balanceador de carga para manejar picos de tráfico, así como con un sistema de replicación de base de datos para prevenir la pérdida de datos y garantizar la disponibilidad.