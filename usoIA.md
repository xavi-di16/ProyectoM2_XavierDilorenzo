#Para el uso de Gemini use Chats temporales pero en resumen estas fueron las consultas realizadas

1. Diseño y optimización del esquema relacional (PostgreSQL)

Xavi: ¿Cómo armo el script setup.sql para crear las tablas de autores y posts en PostgreSQL, asegurando que si borro un autor se borren sus posts?
Gemini: Para lograr eso, necesitás establecer una relación de clave foránea con la restricción ON DELETE CASCADE. Esto le indica a PostgreSQL que mantenga la integridad referencial automáticamente. Aquí tenés el fragmento exacto para la tabla de posts: author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE.

2. Implementación del patrón Pool y estructuración

Xavi: ¿Cuál es la mejor práctica para conectar Express con la base de datos sin saturar las conexiones por cada petición que reciban mis rutas?
Gemini: Lo ideal es implementar el patrón Pool aislando la lógica. Debes crear un archivo db/config.js que inicialice const pool = new Pool(config); y lo exporte. Luego, en tus archivos de la carpeta routes/, importás este pool. Así, toda tu API recicla un mismo grupo de conexiones activas.

3. Generación del archivo YAML para Swagger UI

Xavi: Necesito documentar el endpoint GET /authors de mi API usando OpenAPI 3.0. ¿Cómo es la estructura correcta para escribirlo en el archivo openapi.yaml?
Gemini: En YAML, la indentación es la clave de la estructura. Tenés que definir el nodo principal paths, luego la ruta /authors, y anidar el método get. Adentro, especificás el bloque responses, declarando el código 200 y detallando que el contenido es un array en formato application/json.

4. Redacción de pruebas con Vitest y Supertest

Xavi: ¿Cómo escribo un test automatizado básico usando Vitest y Supertest para comprobar que la ruta principal de autores devuelve un código 200?
Gemini: Primero, asegurate de exportar tu servidor al final de server.js usando module.exports = app. En tu archivo api.test.js, importá la app y request de supertest. Usa un bloque it asíncrono para ejecutar const res = await request(app).get('/authors') y validá el resultado con expect(res.statusCode).toBe(200).

#Claude Code
Para no llenar con imagenes de mucho codigo dejo el link de mi chat con claude donde pude ampliar las verificaciones y mejorar el test: https://claude.ai/share/395edd54-c199-4ae5-8c11-412188cb87eb
