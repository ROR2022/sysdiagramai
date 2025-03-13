4. TRADE-OFFS Y ALTERNATIVAS

La arquitectura y tecnologías seleccionadas proporcionan la simplicidad y ligereza necesaria para este proyecto. Las alternativas podrían incluir el uso de un lenguaje de backend más robusto como Java, o el uso de una base de datos más poderosa como PostgreSQL. Sin embargo, estas alternativas podrían ser excesivas para una aplicación con requisitos de escalabilidad y seguridad moderados.

Para manejar fallos, la aplicación seguirá la estrategia de reintentar la generación de URL corta si la primera es duplicada y también se programará para reintentar las operaciones de base de datos si fallan inicialmente.