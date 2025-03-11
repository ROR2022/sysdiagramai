# Verificación de configuración de MongoDB Atlas

Si estás experimentando problemas de conexión a MongoDB Atlas, sigue estos pasos para verificar la configuración:

## 1. Verifica la lista blanca de IPs en MongoDB Atlas

1. Inicia sesión en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Selecciona tu proyecto y cluster
3. Haz clic en "Network Access" en el menú lateral
4. Verifica que tu IP actual esté en la lista de IPs permitidas
   - Puedes añadir tu IP actual haciendo clic en "+ ADD IP ADDRESS" y seleccionando "ADD CURRENT IP ADDRESS"
   - Para desarrollo, puedes permitir todas las IPs temporalmente añadiendo `0.0.0.0/0` (no recomendado para producción)

## 2. Prueba la conexión desde otro entorno

Intenta conectarte a tu base de datos MongoDB Atlas desde otro entorno o herramienta:
- [MongoDB Compass](https://www.mongodb.com/products/compass) (aplicación de escritorio)
- [MongoDB Shell](https://www.mongodb.com/docs/mongodb-shell/) (línea de comandos)
- Otro dispositivo o red

## 3. Verifica la configuración de firewall

Si tienes un firewall personal o corporativo, asegúrate de que permita conexiones salientes a:
- Puerto 27017 (puerto estándar de MongoDB)
- `*.mongodb.net` (dominio de MongoDB Atlas)

## 4. Solución alternativa para desarrollo

Para desarrollo local, puedes:

1. **Usar MongoDB local**:
   - [Instalar MongoDB Community Edition](https://www.mongodb.com/docs/manual/installation/)
   - Actualizar tu `.env.local` para usar `mongodb://localhost:27017/sysdiagramai`

2. **Usar una base de datos en memoria**:
   - Implementar [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) para pruebas y desarrollo

3. **Usar otro servicio de MongoDB**:
   - [MongoDB Atlas](https://www.mongodb.com/atlas/database) (prueba con una región diferente)
   - [Railway](https://railway.app/)
   - [Render](https://render.com/)

## 5. Solución temporal para evitar problemas de timeout

Si necesitas una solución temporal mientras resuelves los problemas de conexión, puedes modificar tu aplicación para que use un almacenamiento temporal (como un almacenamiento en memoria o local) durante el desarrollo. 