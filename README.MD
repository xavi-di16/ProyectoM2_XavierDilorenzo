# 📝 MiniBlog API

API REST para la gestión de **autores**, **publicaciones** y **comentarios**, desarrollada como Proyecto Integrador. Construida con Node.js, Express y PostgreSQL, con un diseño relacional robusto, código limpio y validaciones de seguridad.

> **🌟 Extra Credit implementado:** se integró la entidad `comments` con su tabla en la base de datos, endpoints RESTful para su creación y lectura, y borrado en cascada (al eliminar un autor o un post, se eliminan sus comentarios asociados).

---

## 📑 Tabla de contenidos

- [Enlaces de producción](#-enlaces-de-producción)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Instalación y configuración local](#️-instalación-y-configuración-local)
- [Testing automatizado](#-testing-automatizado)
- [Documentación de la API](#-documentación-de-la-api-swagger-ui)
- [Deployment en Railway](#️-deployment-en-railway)
- [Uso de la IA](#-documentación-del-uso-de-la-ia)
- [Autor y contacto](#-autor-y-contacto)

---

## 🚀 Enlaces de producción

| Recurso | URL |
|---|---|
| **API principal** | https://proyectom2xavierdilorenzo-production-2821.up.railway.app/ |
| **Swagger UI (documentación)** | https://proyectom2xavierdilorenzo-production-2821.up.railway.app/api-docs |

---

## 🛠 Tecnologías utilizadas

| Área | Herramientas |
|---|---|
| **Backend** | Node.js, Express |
| **Base de datos** | PostgreSQL, `pg` (node-postgres) |
| **Testing** | Vitest, Supertest |
| **Documentación** | OpenAPI 3.0, Swagger UI |

---

## ⚙️ Instalación y configuración local

**Requisitos previos:** tener instalados [Node.js](https://nodejs.org/) y [PostgreSQL](https://www.postgresql.org/).

### 1. Clonar e instalar dependencias

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
npm install
```

### 2. Crear la base de datos

Inicia PostgreSQL (`psql`) y ejecuta:

```sql
CREATE DATABASE miniblog_db;
\c miniblog_db
```

Luego corre el script de inicialización, que crea las tablas y carga los datos de prueba (seed):

```sql
\i db/setup.sql
```

### 3. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`.

**En desarrollo (local):** completa con tus credenciales de PostgreSQL.

```env
DB_USER=postgres
DB_PASSWORD=tu_contraseña_local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_db
PORT=8080
```

**En producción (Railway):** la API ignora las variables individuales y utiliza un único string de conexión provisto por el hosting mediante `DATABASE_URL`.

### 4. Ejecutar la aplicación

```bash
npm run dev
```

La API estará disponible en 👉 **http://localhost:8080**

---

## 🧪 Testing automatizado

El proyecto cuenta con una suite completa de pruebas **E2E** con Vitest y Supertest. Los tests validan el CRUD de autores, posts y comentarios, cubriendo:

- ✅ Casos de éxito
- ⚠️ Errores de validación (`400`)
- 🔍 Manejo de recursos inexistentes (`404`)

Para ejecutar la suite en un entorno limpio:

```bash
npm test
```

---

## 📖 Documentación de la API (Swagger UI)

La documentación es interactiva y sigue el estándar **OpenAPI 3.0**. Con el servidor corriendo localmente, ingresa a:

👉 **http://localhost:8080/api-docs**

Desde allí puedes ver la estructura de todos los endpoints y realizar peticiones de prueba directamente desde el navegador.

---

## ☁️ Deployment en Railway

La API está preparada para despliegue continuo en [Railway](https://railway.app/). Pasos para replicarlo:

1. **Base de datos:** crea un nuevo proyecto en Railway y agrega un servicio de **PostgreSQL**.
2. **Aplicación:** agrega un nuevo servicio conectando tu repositorio de GitHub.
3. **Variables de entorno (servicio web):** en la configuración del servicio de Express agrega:

   ```env
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

   > El nombre del servicio en la referencia (`Postgres`, `postgres`, etc.) debe coincidir con el de tu servicio de base de datos en Railway.

4. **URLs en Railway:**
   - **Internal URL:** Railway la usa automáticamente para la comunicación privada y segura entre la app Node.js y PostgreSQL.
   - **Public URL:** genera un dominio público en la pestaña **Networking** del servicio web para que la API sea accesible desde internet.

---

## 🤖 Documentación del uso de la IA

Durante el desarrollo se utilizó Inteligencia Artificial como herramienta de asistencia técnica y mentoría. Los principales casos de uso fueron:

- Diseño y optimización del esquema relacional en PostgreSQL (`setup.sql`).
- Implementación del patrón **Pool** para la conexión a la base de datos y estructuración de servicios y rutas.
- Generación del archivo YAML para la documentación con OpenAPI y Swagger UI.
- Redacción y cobertura total de pruebas unitarias y de integración con Vitest y Supertest.

Para el detalle completo de los prompts utilizados, consulta el archivo **Especificación de Consultas realizadas** ([`usoIA.md`](./usoIA.md)) en este repositorio.

---

## 👤 Autor y contacto

Proyecto desarrollado por **Xavier Alexander Dilorenzo**.

- 💻 GitHub: [xavi-di16](https://github.com/xavi-di16)
- ✉️ Email: [xadilorenzo@gmail.com](mailto:xadilorenzo@gmail.com)