const express = require('express');
const router = express.Router();
const postService = require('../services/postService');

const badRequest = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const isPositiveInt = (value) => /^[1-9]\d*$/.test(String(value));

// partial = true -> PUT: solo se validan los campos enviados (pero debe venir al menos uno)
const validatePost = (body, partial = false) => {
    // 1. VALIDACIÓN DEFENSIVA: Previene el Error 500 si el body es undefined o vacío
    if (!body || Object.keys(body).length === 0) {
        throw badRequest('El cuerpo de la petición no puede estar vacío');
    }

    // 2. Desestructuración segura
    const { title, content, author_id, published } = body;

    if (partial && title === undefined && content === undefined && published === undefined) {
        throw badRequest('Debes enviar al menos un campo a actualizar: title, content o published');
    }

    if (!partial || title !== undefined) {
        if (typeof title !== 'string' || title.trim().length < 5) {
            throw badRequest('El título es obligatorio y debe tener al menos 5 caracteres');
        }
        if (title.trim().length > 200) {
            throw badRequest('El título no puede superar los 200 caracteres');
        }
    }

    if (!partial || content !== undefined) {
        if (typeof content !== 'string' || content.trim().length < 10) {
            throw badRequest('El contenido es obligatorio y debe tener al menos 10 caracteres');
        }
    }

    // author_id solo se envía al crear (en el PUT no se modifica)
    if (!partial && !isPositiveInt(author_id)) {
        throw badRequest('El author_id es obligatorio y debe ser un número entero positivo');
    }

    if (published !== undefined && typeof published !== 'boolean') {
        throw badRequest('El campo published debe ser un booleano (true o false)');
    }
};

// GET /posts - Listar todos
router.get('/', async (req, res, next) => {
    try {
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (error) {
        next(error);
    }
});

// GET /posts/:id - Detalle de un post
router.get('/:id', validateId(), async (req, res, next) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            const error = new Error('Post no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.json(post);
    } catch (error) {
        next(error);
    }
});

// GET /posts/author/:authorId - Posts de un autor
router.get('/author/:authorId', async (req, res, next) => {
    try {
        const posts = await postService.getPostsByAuthor(req.params.authorId);
        res.json(posts);
    } catch (error) {
        next(error);
    }
});

// POST /posts - Crear post
router.post('/', async (req, res, next) => {
    try {
        validatePost(req.body);
        const { title, content, author_id, published } = req.body;

        const newPost = await postService.createPost(
            title.trim(),
            content.trim(),
            author_id,
            published
        );
        res.status(201).json(newPost);
    } catch (error) {
        // Clave foránea (el autor no existe)
        if (error.code === '23503') {
            error.statusCode = 400;
            error.message = 'El author_id especificado no existe';
        }
        next(error);
    }
});

// PUT /posts/:id - Actualizar post
router.put('/:id', validateId(), async (req, res, next) => {
    try {
        validatePost(req.body, true);
        const { title, content, published } = req.body;

        const updatedPost = await postService.updatePost(
            req.params.id,
            title !== undefined ? title.trim() : undefined,
            content !== undefined ? content.trim() : undefined,
            published
        );

        if (!updatedPost) {
            const error = new Error('Post no encontrado para actualizar');
            error.statusCode = 404;
            throw error;
        }
        res.json(updatedPost);
    } catch (error) {
        next(error);
    }
});

// DELETE /posts/:id - Eliminar post
router.delete('/:id', validateId(), async (req, res, next) => {
    try {
        const deletedPost = await postService.deletePost(req.params.id);
        if (!deletedPost) {
            const error = new Error('Post no encontrado para eliminar');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            mensaje: `El post '${deletedPost.title}' fue eliminado correctamente del sistema`,
            registro_eliminado: deletedPost
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
