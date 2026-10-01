const { loadEnvFile } = require('node:process');

// Solo cargamos el .env si no estamos en producción (Railway)
if (process.env.NODE_ENV !== 'production') {
    loadEnvFile('.env');
}

const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');
const app = express();
const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(express.json()); // Para que Express entienda el body en formato JSON
app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

// Ruta de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta raíz de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API MiniBlog funcionando' });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
