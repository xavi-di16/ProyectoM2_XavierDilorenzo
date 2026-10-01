# MiniBlog API

API REST para la gestión de autores, publicaciones y comentarios, desarrollada como proyecto integrador. Construida con Node.js, Express y PostgreSQL, enfocada en un diseño relacional robusto y código limpio.

## Tecnologías Utilizadas
* **Backend:** Node.js, Express
* **Base de Datos:** PostgreSQL, `pg` (node-postgres)
* **Testing:** Vitest, Supertest
* **Documentación:** OpenAPI 3.0, Swagger UI

## Requisitos y Configuración Local

Para ejecutar este proyecto en tu entorno local, necesitas tener instalados Node.js y PostgreSQL[cite: 698].

### 1. Instalación y Base de Datos
1. Clona el repositorio e instala las dependencias[cite: 698]:
   ```bash
   npm install
   ```
2. Inicia PostgreSQL (`psql`) y crea la base de datos:
   ```sql
   CREATE DATABASE miniblog_db;
   \c miniblog_db
   ```
3. Ejecuta el script de inicialización para crear las tablas y los datos de prueba (Seed)[cite: 698]:
   ```sql
   \i db/setup.sql
   ```

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example` incluido[cite: 698]. Completa con tus credenciales locales de PostgreSQL:
```env
DB_USER=postgres
DB_PASSWORD=tu_contraseña_local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_db
PORT=3000
```

### 3. Ejecutar la Aplicación
Inicia el servidor en modo desarrollo:
```bash
npm run dev
```
La API estará disponible en `http://localhost:3000`.

## Testing
El proyecto cuenta con una suite de pruebas automatizadas para validar los endpoints principales y el manejo de errores. Para ejecutarlas, utiliza[cite: 698]:
```bash
npm test
```

## Documentación API (Swagger UI)
La documentación completa e interactiva de la API está disponible mediante Swagger UI. Una vez que el servidor esté corriendo, ingresa a[cite: 698]:
👉 **http://localhost:3000/api-docs**

Desde allí podrás visualizar la estructura de los endpoints (GET, POST, PUT, DELETE) y realizar peticiones de prueba directamente desde el navegador.

## Guía de Deployment (Railway)
Esta API está diseñada para ser desplegada fácilmente en Railway siguiendo estos pasos[cite: 698]:

1. **Base de Datos:** Crea un nuevo proyecto en Railway y agrega un servicio de PostgreSQL.
2. **Aplicación:** Agrega un nuevo servicio conectando este repositorio de GitHub.
3. **Variables de Entorno:** En la configuración de tu servicio de Express, agrega:
   * `NODE_ENV`: `production`
   * `DATABASE_URL`: `${{postgres.DATABASE_URL}}` (o referenciando la variable interna de tu DB generada por Railway).
4. **URLs:** 
   * La aplicación se comunicará internamente con la DB usando la URL privada[cite: 698].
   * Genera un dominio público en la pestaña *Networking* de Railway para acceder a la API desde internet[cite: 698].

## Documentación del uso de la IA
Durante el desarrollo de esta API, se utilizó Inteligencia Artificial como herramienta de asistencia técnica y mentoría[cite: 698]. Los casos de uso principales incluyeron:
* Diseño y optimización del esquema relacional en PostgreSQL (`setup.sql`).
* Implementación del patrón Pool para la conexión a la base de datos y la estructuración de servicios/rutas.
* Generación del archivo YAML para la documentación con OpenAPI y Swagger UI.
* Redacción de las pruebas unitarias y de integración utilizando Vitest y Supertest.

---

## Autor y Contacto

Proyecto desarrollado por **Xavier Alexander Dilorenzo**.

* 💻 **GitHub:** [xavi-di16](http://github.com/xavi-di16)
* ✉️ **Email:** [xadilorenzo@gmail.com](mailto:xadilorenzo@gmail.com)