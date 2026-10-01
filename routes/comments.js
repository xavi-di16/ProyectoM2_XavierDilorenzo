const express = require('express');
const router = express.Router();
const commentService = require('../services/commentService');

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
        const { content, post_id, author_id } = req.body;
        
        // Validación obligatoria
        if (!content || !post_id || !author_id) {
            const error = new Error('Los campos content, post_id y author_id son obligatorios');
            error.statusCode = 400;
            throw error;
        }

        const newComment = await commentService.createComment(content, post_id, author_id);
        res.status(201).json(newComment);
    } catch (error) {
        // Manejo de error de clave foránea (el autor o el post no existen)
        if (error.code === '23503') {
            error.statusCode = 400;
            error.message = 'El post_id o author_id especificado no existe';
        }
        next(error);
    }
});

module.exports = router;