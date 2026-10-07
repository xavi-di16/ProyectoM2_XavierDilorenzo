# MiniBlog API

API REST para la gestión de autores, publicaciones y comentarios, desarrollada como proyecto integrador. Construida con Node.js, Express y PostgreSQL, enfocada en un diseño relacional robusto y código limpio.


# Deployment - Swagger
🚀link principal: https://proyectom2xavierdilorenzo-production-2821.up.railway.app/

👽Swagger: https://proyectom2xavierdilorenzo-production-2821.up.railway.app/api-docs


## Tecnologías Utilizadas
* **Backend:** Node.js, Express
* **Base de Datos:** PostgreSQL, `pg` (node-postgres)
* **Testing:** Vitest, Supertest
* **Documentación:** OpenAPI 3.0, Swagger UI

## Requisitos y Configuración Local

Para ejecutar este proyecto en tu entorno local, necesitas tener instalados Node.js y PostgreSQL.

### 1. Instalación y Base de Datos
1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia PostgreSQL (`psql`) y crea la base de datos:
   ```sql
   CREATE DATABASE miniblog_db;
   \c miniblog_db
   ```
3. Ejecuta el script de inicialización para crear las tablas y los datos de prueba (Seed):
   ```sql
   \i db/setup.sql
   ```

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example` incluido. Completa con tus credenciales locales de PostgreSQL:
```env
DB_USER=postgres
DB_PASSWORD=tu_contraseña_local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_db
PORT=8080
```

### 3. Ejecutar la Aplicación
Inicia el servidor en modo desarrollo:
```bash
npm run dev
```
La API estará disponible en `http://localhost:8080`.

## Testing
El proyecto cuenta con una suite de pruebas automatizadas para validar los endpoints principales y el manejo de errores. Para ejecutarlas, utiliza:
```bash
npm test
```

## Documentación API (Swagger UI)
La documentación completa e interactiva de la API está disponible mediante Swagger UI. Una vez que el servidor esté corriendo, ingresa a:
👉 **http://localhost:8080/api-docs**

Desde allí podrás visualizar la estructura de los endpoints (GET, POST, PUT, DELETE) y realizar peticiones de prueba directamente desde el navegador.

## Guía de Deployment (Railway)
Esta API está diseñada para ser desplegada fácilmente en Railway siguiendo estos pasos:

1. **Base de Datos:** Crea un nuevo proyecto en Railway y agrega un servicio de PostgreSQL.
2. **Aplicación:** Agrega un nuevo servicio conectando este repositorio de GitHub.
3. **Variables de Entorno:** En la configuración de tu servicio de Express, agrega:
   * `NODE_ENV`: `production`
   * `DATABASE_URL`: `${{postgres.DATABASE_URL}}` (o referenciando la variable interna de tu DB generada por Railway).
4. **URLs:** 
   * La aplicación se comunicará internamente con la DB usando la URL privada.
   * Genera un dominio público en la pestaña *Networking* de Railway para acceder a la API desde internet.

## Documentación del uso de la IA
Durante el desarrollo de esta API, se utilizó Inteligencia Artificial como herramienta de asistencia técnica y mentoría. Los casos de uso principales incluyeron:
* Diseño y optimización del esquema relacional en PostgreSQL (`setup.sql`).
* Implementación del patrón Pool para la conexión a la base de datos y la estructuración de servicios/rutas.
* Generación del archivo YAML para la documentación con OpenAPI y Swagger UI.
* Redacción de las pruebas unitarias y de integración utilizando Vitest y Supertest.
[Especificacion de Consultas realizadas](usoIA.md)

---

## Autor y Contacto

Proyecto desarrollado por **Xavier Alexander Dilorenzo**.

* 💻 **GitHub:** [xavi-di16](http://github.com/xavi-di16)
* ✉️ **Email:** [xadilorenzo@gmail.com](mailto:xadilorenzo@gmail.com)
