const request = require('supertest');
const app = require('../server'); // Importamos la app de Express

describe('Pruebas de la API MiniBlog', () => {

    // 1. Obtener autores (Caso de éxito)
    it('GET /authors - Debería devolver un array de autores y status 200', async () => {
        const res = await request(app).get('/authors');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // 2. Crear autor (Caso de éxito)
    it('POST /authors - Debería crear un autor nuevo y devolver status 201', async () => {
        const newAuthor = {
            name: 'Autor de Prueba',
            // Usamos Date.now() para que el email sea único en cada ejecución del test
            email: `prueba_${Date.now()}@example.com`, 
            bio: 'Bio de test'
        };
        const res = await request(app).post('/authors').send(newAuthor);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(newAuthor.name);
    });

    // 3. Crear autor con error (Caso de error)
    it('POST /authors - Debería devolver error 400 si falta el nombre', async () => {
        const res = await request(app).post('/authors').send({ 
            email: `malo_${Date.now()}@example.com` 
        }); // No le mandamos el 'name'
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    // 4. Obtener autor específico (Caso de éxito)
    it('GET /authors/1 - Debería obtener el autor con ID 1', async () => {
        const res = await request(app).get('/authors/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
    });

    // 5. Crear post (Caso de éxito)
    it('POST /posts - Debería crear un post nuevo', async () => {
        const newPost = {
            title: 'Test Post',
            content: 'Contenido de prueba',
            author_id: 1 // Asumimos que el autor 1 existe por nuestro script seed
        };
        const res = await request(app).post('/posts').send(newPost);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(newPost.title);
    });

    // 6. Eliminar recurso inexistente (Caso de error)
    it('DELETE /posts/9999 - Debería devolver 404 al intentar eliminar un post que no existe', async () => {
        const res = await request(app).delete('/posts/9999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
    });

});