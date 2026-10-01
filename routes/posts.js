const express = require('express');
const router = express.Router();
const postService = require('../services/postService');

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
router.get('/:id', async (req, res, next) => {
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
        const { title, content, author_id, published } = req.body;
        
        // Validaciones obligatorias de la rúbrica
        if (!title || !content || !author_id) {
            const error = new Error('Los campos title, content y author_id son obligatorios');
            error.statusCode = 400;
            throw error;
        }

        const newPost = await postService.createPost(title, content, author_id, published);
        res.status(201).json(newPost);
    } catch (error) {
        // Manejo de error de clave foránea (el autor no existe)
        if (error.code === '23503') {
            error.statusCode = 400;
            error.message = 'El author_id especificado no existe';
        }
        next(error);
    }
});

// PUT /posts/:id - Actualizar post
router.put('/:id', async (req, res, next) => {
    try {
        const { title, content, published } = req.body;
        const updatedPost = await postService.updatePost(req.params.id, title, content, published);
        
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
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedPost = await postService.deletePost(req.params.id);
        if (!deletedPost) {
            const error = new Error('Post no encontrado para eliminar');
            error.statusCode = 404;
            throw error;
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;