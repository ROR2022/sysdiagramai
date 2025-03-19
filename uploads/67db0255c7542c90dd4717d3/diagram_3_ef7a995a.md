3. DISEÑO DETALLADO Y TECNOLOGÍAS

   - Las principales entidades son Producto, Transacción (entrada o salida) y Alerta. Producto tiene un SKU, nombre, descripción, cantidad en stock. Transacciones incluye SKU del producto, tipo de transacción (entrada o salida), cantidad y fecha. Alerta contiene SKU, umbral y estado (activada o desactivada).

   - Diagrama de Base de Datos (Usa Mermaid):

``` 
erDiagram
          PRODUCTO ||..|| TRANSACCIÓN : registra
          PRODUCTO ||--|| ALERTA : tiene
```

   - Este diagrama muestra las relaciones entre las entidades. Cada producto puede tener varias transacciones asociadas y una alerta de stock bajo.

   - Diseño de APIs: 
     - POST /productos/{sku}/entrada - Registrar entrada de productos. Recibe como parámetros el SKU y la cantidad.
     - POST /productos/{sku}/salida - Registrar salida de productos. Recibe como parámetros el SKU y la cantidad.
     - GET /productos/{sku} - Consultar el stock actual de un producto.
     - PUT /alertas/{sku} - Configurar una alerta de stock bajo. Recibe el SKU y el umbral.
     - GET /reportes/{sku} - Generar un reporte de inventario.
  
   - Stack tecnológico: Para el servidor utilizaremos Node.js, con Express.js como framework por su facilidad de uso y alta escalabilidad. La base de datos será PostgresSQL por su consistencia y robustez.
  
   - Seguridad: Implementaremos autenticación y autorización mediante JWT. Además, la conexión será mediante HTTPS.
  
   - El sistema se manejará con una arquitectura escalable horizontalmente, lo que permitirá añadir más servidores en caso que la demanda lo requiera. Asimismo, se implementará un balanceador de carga para distribuir equitativamente las peticiones.