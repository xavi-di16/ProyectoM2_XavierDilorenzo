const request = require('supertest');
const app = require('../server'); // server.js debe terminar con "module.exports = app;"

const uniqueEmail = (prefix = 'tester') => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;
const NON_EXISTENT_ID = 999999;

describe('Suite de Pruebas E2E - API MiniBlog', () => {
    // IDs y datos compartidos entre tests
    let testAuthorId;
    let testAuthorName;
    let testPostId;
    let testPostTitle;
    let testPostId2; // post dedicado a la prueba de DELETE (sin comentarios)

    // ---------------------------------------------------------------
    // 1. AUTORES
    // ---------------------------------------------------------------
    describe('1. Autores (Authors)', () => {
        describe('POST /authors', () => {
            it('Debería crear un autor y normalizar nombre/email (201)', async () => {
                const email = uniqueEmail('Tester').toUpperCase().replace('@EXAMPLE.COM', '@Example.com');
                const res = await request(app)
                    .post('/authors')
                    .send({ name: '  Test Author  ', email: `  ${email}  `, bio: 'Bio generada por el test' });

                expect(res.status).toBe(201);
                expect(res.body).toHaveProperty('id');
                expect(res.body.name).toBe('Test Author');            // trim
                expect(res.body.email).toBe(email.toLowerCase());     // toLowerCase + trim

                testAuthorId = res.body.id;
                testAuthorName = res.body.name;
            });
           
            it('POST /authors - Debería devolver error 400 si el body está vacío o no se envía', async () => {
                const res = await request(app).post('/authors').send({}); // Body vacío simulando la falla de Swagger
                expect(res.statusCode).toBe(400);
                expect(res.body).toHaveProperty('error');
                expect(res.body.error).toBe('El cuerpo de la petición no puede estar vacío');
            });

            it('Debería fallar si falta el nombre (400)', async () => {
                const res = await request(app).post('/authors').send({ email: uniqueEmail() });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El nombre es obligatorio y debe tener al menos 3 caracteres');
            });

            it('Debería fallar si el nombre tiene menos de 3 caracteres (400)', async () => {
                const res = await request(app).post('/authors').send({ name: 'Al', email: uniqueEmail() });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El nombre es obligatorio y debe tener al menos 3 caracteres');
            });

            it('Debería fallar si el nombre son solo espacios (400)', async () => {
                const res = await request(app).post('/authors').send({ name: '     ', email: uniqueEmail() });
                expect(res.status).toBe(400);
            });

            it('Debería fallar si el nombre supera los 100 caracteres (400)', async () => {
                const res = await request(app).post('/authors').send({ name: 'a'.repeat(101), email: uniqueEmail() });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El nombre no puede superar los 100 caracteres');
            });

            it('Debería fallar si falta el email (400)', async () => {
                const res = await request(app).post('/authors').send({ name: 'Sin Email' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El email es obligatorio');
            });

            it.each([
                'sinarroba.com',
                'a@x',
                'user@example',
                'a..b@example.com',
                '.a@example.com',
                'a.@example.com',
                'user@@example.com',
                'us er@example.com',
                'user@example.c'
            ])('Debería rechazar el email con formato inválido "%s" (400)', async (badEmail) => {
                const res = await request(app).post('/authors').send({ name: 'Email Malo', email: badEmail });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El formato del email no es válido');
            });

            it('Debería fallar si la bio no es texto (400)', async () => {
                const res = await request(app)
                    .post('/authors')
                    .send({ name: 'Bio Mala', email: uniqueEmail(), bio: 12345 });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('La bio debe ser un texto');
            });

            it('Debería fallar por email duplicado (400)', async () => {
                const emailDuplicado = uniqueEmail('dup');
                const primero = await request(app).post('/authors').send({ name: 'Original', email: emailDuplicado });
                expect(primero.status).toBe(201);

                const res = await request(app).post('/authors').send({ name: 'Copia', email: emailDuplicado });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El email ya está registrado');

                // Limpieza del autor auxiliar
                await request(app).delete(`/authors/${primero.body.id}`);
            });
        });

        describe('GET /authors', () => {
            it('Debería listar autores (200)', async () => {
                const res = await request(app).get('/authors');
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            });

            it('Debería devolver el detalle del autor creado (200)', async () => {
                const res = await request(app).get(`/authors/${testAuthorId}`);
                expect(res.status).toBe(200);
                expect(res.body.id).toBe(testAuthorId);
            });

            it('Debería devolver 404 si el autor no existe', async () => {
                const res = await request(app).get(`/authors/${NON_EXISTENT_ID}`);
                expect(res.status).toBe(404);
                expect(res.body.error).toBe('Autor no encontrado');
            });
        });

        describe('PUT /authors/:id', () => {
            it('Debería actualizar solo el nombre y conservar el resto (200)', async () => {
                const antes = (await request(app).get(`/authors/${testAuthorId}`)).body;

                const res = await request(app)
                    .put(`/authors/${testAuthorId}`)
                    .send({ name: 'Autor Actualizado' });

                expect(res.status).toBe(200);
                expect(res.body.name).toBe('Autor Actualizado');
                expect(res.body.email).toBe(antes.email); // COALESCE: no se pisa

                testAuthorName = res.body.name;
            });

            it('Debería fallar si el body no trae ningún campo (400)', async () => {
                const res = await request(app).put(`/authors/${testAuthorId}`).send({});
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El cuerpo de la petición no puede estar vacío');
            });

            it('Debería fallar si el nombre nuevo es muy corto (400)', async () => {
                const res = await request(app).put(`/authors/${testAuthorId}`).send({ name: 'ab' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El nombre es obligatorio y debe tener al menos 3 caracteres');
            });

            it('Debería fallar si el email nuevo tiene formato inválido (400)', async () => {
                const res = await request(app).put(`/authors/${testAuthorId}`).send({ email: 'a..b@example.com' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El formato del email no es válido');
            });

            it('Debería devolver 404 si el autor a actualizar no existe', async () => {
                const res = await request(app).put(`/authors/${NON_EXISTENT_ID}`).send({ name: 'Fantasma' });
                expect(res.status).toBe(404);
                expect(res.body.error).toBe('Autor no encontrado para actualizar');
            });
        });
    });

    // ---------------------------------------------------------------
    // 2. POSTS
    // ---------------------------------------------------------------
    describe('2. Publicaciones (Posts)', () => {
        describe('POST /posts', () => {
            it('Debería crear un post asignado al autor de prueba (201)', async () => {
                const res = await request(app)
                    .post('/posts')
                    .send({
                        title: '  Título de prueba  ',
                        content: 'Contenido validado por el test',
                        author_id: testAuthorId
                    });

                expect(res.status).toBe(201);
                expect(res.body).toHaveProperty('id');
                expect(res.body.title).toBe('Título de prueba'); // trim
                expect(res.body.author_id).toBe(testAuthorId);
                expect(res.body.published).toBe(false);          // default

                testPostId = res.body.id;
                testPostTitle = res.body.title;
            });

            it('Debería crear un segundo post (para la prueba de DELETE) (201)', async () => {
                const res = await request(app)
                    .post('/posts')
                    .send({
                        title: 'Post para eliminar',
                        content: 'Este post será borrado por el test',
                        author_id: testAuthorId,
                        published: true
                    });

                expect(res.status).toBe(201);
                expect(res.body.published).toBe(true);
                testPostId2 = res.body.id;
            });

            it('Debería fallar si falta el título (400)', async () => {
                const res = await request(app)
                    .post('/posts')
                    .send({ content: 'Contenido suficientemente largo', author_id: testAuthorId });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El título es obligatorio y debe tener al menos 5 caracteres');
            });

            it('Debería fallar si el título tiene menos de 5 caracteres (400)', async () => {
                const res = await request(app)
                    .post('/posts')
                    .send({ title: 'Hola', content: 'Contenido suficientemente largo', author_id: testAuthorId });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El título es obligatorio y debe tener al menos 5 caracteres');
            });

            it('Debería fallar si el título supera los 200 caracteres (400)', async () => {
                const res = await request(app)
                    .post('/posts')
                    .send({ title: 'a'.repeat(201), content: 'Contenido suficientemente largo', author_id: testAuthorId });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El título no puede superar los 200 caracteres');
            });

            it('Debería fallar si falta el contenido (400)', async () => {
                const res = await request(app)
                    .post('/posts')
                    .send({ title: 'Falta contenido y autor' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El contenido es obligatorio y debe tener al menos 10 caracteres');
            });

            it('Debería fallar si el contenido tiene menos de 10 caracteres (400)', async () => {
                const res = await request(app)
                    .post('/posts')
                    .send({ title: 'Título válido', content: 'corto', author_id: testAuthorId });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El contenido es obligatorio y debe tener al menos 10 caracteres');
            });

            it('Debería fallar si falta el author_id (400)', async () => {
                const res = await request(app)
                    .post('/posts')
                    .send({ title: 'Título válido', content: 'Contenido suficientemente largo' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El author_id es obligatorio y debe ser un número entero positivo');
            });

            it.each(['abc', -1, 0, 1.5])('Debería fallar si el author_id es inválido (%p) (400)', async (badId) => {
                const res = await request(app)
                    .post('/posts')
                    .send({ title: 'Título válido', content: 'Contenido suficientemente largo', author_id: badId });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El author_id es obligatorio y debe ser un número entero positivo');
            });

            it('Debería fallar si published no es booleano (400)', async () => {
                const res = await request(app)
                    .post('/posts')
                    .send({
                        title: 'Título válido',
                        content: 'Contenido suficientemente largo',
                        author_id: testAuthorId,
                        published: 'si'
                    });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El campo published debe ser un booleano (true o false)');
            });

            it('Debería fallar si el author_id no existe en la base (400)', async () => {
                const res = await request(app)
                    .post('/posts')
                    .send({
                        title: 'Post fantasma',
                        content: 'Este autor no existe',
                        author_id: NON_EXISTENT_ID
                    });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El author_id especificado no existe'); // catch de Postgres (23503)
            });
        });

        describe('GET /posts', () => {
            it('Debería listar los posts de un autor específico (200)', async () => {
                const res = await request(app).get(`/posts/author/${testAuthorId}`);
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeGreaterThan(0);
                expect(res.body[0].author_id).toBe(testAuthorId);
            });
        });

        describe('PUT /posts/:id', () => {
            it('Debería actualizar solo el título y conservar el contenido (200)', async () => {
                const res = await request(app)
                    .put(`/posts/${testPostId}`)
                    .send({ title: 'Título actualizado' });

                expect(res.status).toBe(200);
                expect(res.body.title).toBe('Título actualizado');
                expect(res.body.content).toBe('Contenido validado por el test'); // COALESCE

                testPostTitle = res.body.title;
            });

            it('Debería poder publicar el post (200)', async () => {
                const res = await request(app).put(`/posts/${testPostId}`).send({ published: true });
                expect(res.status).toBe(200);
                expect(res.body.published).toBe(true);
            });

            it('Debería fallar si el body no trae ningún campo (400)', async () => {
                const res = await request(app).put(`/posts/${testPostId}`).send({});
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El cuerpo de la petición no puede estar vacío');
            });

            it('Debería fallar si el título nuevo es muy corto (400)', async () => {
                const res = await request(app).put(`/posts/${testPostId}`).send({ title: 'abc' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El título es obligatorio y debe tener al menos 5 caracteres');
            });

            it('Debería fallar si el contenido nuevo es muy corto (400)', async () => {
                const res = await request(app).put(`/posts/${testPostId}`).send({ content: 'corto' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El contenido es obligatorio y debe tener al menos 10 caracteres');
            });

            it('Debería fallar si published no es booleano (400)', async () => {
                const res = await request(app).put(`/posts/${testPostId}`).send({ published: 'true' });
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('El campo published debe ser un booleano (true o false)');
            });

            it('Debería devolver 404 si el post a actualizar no existe', async () => {
                const res = await request(app)
                    .put(`/posts/${NON_EXISTENT_ID}`)
                    .send({ title: 'Título válido' });
                expect(res.status).toBe(404);
                expect(res.body.error).toBe('Post no encontrado para actualizar');
            });
        });
    });

    // ---------------------------------------------------------------
    // 3. COMENTARIOS
    // ---------------------------------------------------------------
    describe('3. Comentarios (Comments)', () => {
        it('POST /comments - Debería crear un comentario (201)', async () => {
            const res = await request(app)
                .post('/comments')
                .send({ content: '  Buen post!  ', post_id: testPostId, author_id: testAuthorId });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.content).toBe('Buen post!'); // trim
            expect(res.body.post_id).toBe(testPostId);
        });

        it('POST /comments - Debería fallar si falta el contenido (400)', async () => {
            const res = await request(app).post('/comments').send({ post_id: testPostId, author_id: testAuthorId });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('El contenido es obligatorio y debe tener al menos 3 caracteres');
        });

        it('POST /comments - Debería fallar si el contenido tiene menos de 3 caracteres (400)', async () => {
            const res = await request(app)
                .post('/comments')
                .send({ content: 'ok', post_id: testPostId, author_id: testAuthorId });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('El contenido es obligatorio y debe tener al menos 3 caracteres');
        });

        it('POST /comments - Debería fallar si post_id es inválido (400)', async () => {
            const res = await request(app)
                .post('/comments')
                .send({ content: 'Comentario válido', post_id: 'abc', author_id: testAuthorId });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('El post_id es obligatorio y debe ser un número entero positivo');
        });

        it('POST /comments - Debería fallar si falta author_id (400)', async () => {
            const res = await request(app)
                .post('/comments')
                .send({ content: 'Comentario válido', post_id: testPostId });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('El author_id es obligatorio y debe ser un número entero positivo');
        });

        it('POST /comments - Debería fallar si el post no existe (400)', async () => {
            const res = await request(app)
                .post('/comments')
                .send({ content: 'Comentario válido', post_id: NON_EXISTENT_ID, author_id: testAuthorId });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('El post_id o author_id especificado no existe'); // catch de Postgres (23503)
        });

        it('GET /comments/post/:postId - Debería listar los comentarios del post (200)', async () => {
            const res = await request(app).get(`/comments/post/${testPostId}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].post_id).toBe(testPostId);
        });
    });

    // ---------------------------------------------------------------
    // 4. ELIMINACIONES (200 + mensaje + registro_eliminado) Y 404
    // ---------------------------------------------------------------
    describe('4. Eliminación y manejo de errores 404', () => {
        it('DELETE /posts/:id - Debería eliminar el post y devolver el registro eliminado (200)', async () => {
            const res = await request(app).delete(`/posts/${testPostId2}`);

            expect(res.status).toBe(200);
            expect(res.body.mensaje).toBe("El post 'Post para eliminar' fue eliminado correctamente del sistema");
            expect(res.body).toHaveProperty('registro_eliminado');
            expect(res.body.registro_eliminado).toMatchObject({
                id: testPostId2,
                title: 'Post para eliminar',
                author_id: testAuthorId
            });
        });

        it('GET /posts/:id - Debería fallar al buscar el post recién eliminado (404)', async () => {
            const res = await request(app).get(`/posts/${testPostId2}`);
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Post no encontrado');
        });

        it('DELETE /posts/:id - Debería devolver 404 si el post ya no existe', async () => {
            const res = await request(app).delete(`/posts/${testPostId2}`);
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Post no encontrado para eliminar');
        });

        it('DELETE /posts/:id - Debería eliminar el post principal (200)', async () => {
            const res = await request(app).delete(`/posts/${testPostId}`);
            expect(res.status).toBe(200);
            expect(res.body.mensaje).toBe(`El post '${testPostTitle}' fue eliminado correctamente del sistema`);
            expect(res.body.registro_eliminado.id).toBe(testPostId);
        });

        it('DELETE /authors/:id - Debería eliminar el autor y devolver el registro eliminado (200)', async () => {
            const res = await request(app).delete(`/authors/${testAuthorId}`);

            expect(res.status).toBe(200);
            expect(res.body.mensaje).toBe(`El autor '${testAuthorName}' fue eliminado correctamente del sistema`);
            expect(res.body.registro_eliminado).toMatchObject({ id: testAuthorId, name: testAuthorName });
        });

        it('GET /authors/:id - Debería fallar al buscar el autor recién eliminado (404)', async () => {
            const res = await request(app).get(`/authors/${testAuthorId}`);
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Autor no encontrado');
        });

        it('DELETE /authors/:id - Debería devolver 404 si el autor no existe', async () => {
            const res = await request(app).delete(`/authors/${NON_EXISTENT_ID}`);
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Autor no encontrado para eliminar');
        });
    });
});
