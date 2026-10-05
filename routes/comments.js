const express = require('express');
const router = express.Router();
const commentService = require('../services/commentService');

const badRequest = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const isPositiveInt = (value) => /^[1-9]\d*$/.test(String(value));

const validateComment = ({ content, post_id, author_id }) => {
    if (typeof content !== 'string' || content.trim().length < 3) {
        throw badRequest('El contenido es obligatorio y debe tener al menos 3 caracteres');
    }
    if (!isPositiveInt(post_id)) {
        throw badRequest('El post_id es obligatorio y debe ser un número entero positivo');
    }
    if (!isPositiveInt(author_id)) {
        throw badRequest('El author_id es obligatorio y debe ser un número entero positivo');
    }
};

// GET /comments/post/:postId - Obtener los comentarios de un post
router.get('/post/:postId', async (req, res, next) => {
    try {
        const comments = await commentService.getCommentsByPost(req.params.postId);
        res.json(comments);
    } catch (error) {
        next(error);
    }
});

// POST /comments - Crear un comentario
router.post('/', async (req, res, next) => {
    try {
        validateComment(req.body);
        const { content, post_id, author_id } = req.body;

        const newComment = await commentService.createComment(content.trim(), post_id, author_id);
        res.status(201).json(newComment);
    } catch (error) {
        // Clave foránea (el autor o el post no existen)
        if (error.code === '23503') {
            error.statusCode = 400;
            error.message = 'El post_id o author_id especificado no existe';
        }
        next(error);
    }
});

module.exports = router;
