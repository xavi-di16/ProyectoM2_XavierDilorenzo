const express = require('express');
const router = express.Router();
const authorService = require('../services/authorService');

// GET /authors - Listar todos
router.get('/', async (req, res, next) => {
    try {
        const authors = await authorService.getAllAuthors();
        res.json(authors);
    } catch (error) {
        next(error);
    }
});

// GET /authors/:id - Detalle de un autor
router.get('/:id', async (req, res, next) => {
    try {
        const author = await authorService.getAuthorById(req.params.id);
        if (!author) {
            const error = new Error('Autor no encontrado');
            error.statusCode = 404;
            throw error;
        }
        res.json(author);
    } catch (error) {
        next(error);
    }
});

// POST /authors - Crear autor
router.post('/', async (req, res, next) => {
    try {
        const { name, email, bio } = req.body;
        
        // Validación obligatoria: name no vacío
        if (!name || name.trim() === '') {
            const error = new Error('El nombre no puede estar vacío');
            error.statusCode = 400;
            throw error;
        }

        const newAuthor = await authorService.createAuthor(name, email, bio);
        res.status(201).json(newAuthor);
    } catch (error) {
        // Manejo de error específico de Postgres: email único (código 23505)
        if (error.code === '23505') {
            error.statusCode = 400;
            error.message = 'El email ya está registrado';
        }
        next(error);
    }
});

// PUT /authors/:id - Actualizar autor
router.put('/:id', async (req, res, next) => {
    try {
        const { name, email, bio } = req.body;
        const updatedAuthor = await authorService.updateAuthor(req.params.id, name, email, bio);
        
        if (!updatedAuthor) {
            const error = new Error('Autor no encontrado para actualizar');
            error.statusCode = 404;
            throw error;
        }
        res.json(updatedAuthor);
    } catch (error) {
        if (error.code === '23505') {
            error.statusCode = 400;
            error.message = 'El email ya está registrado';
        }
        next(error);
    }
});

// DELETE /authors/:id - Eliminar autor
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedAuthor = await authorService.deleteAuthor(req.params.id);
        if (!deletedAuthor) {
            const error = new Error('Autor no encontrado para eliminar');
            error.statusCode = 404;
            throw error;
        }
        res.status(204).send(); // 204 significa éxito pero sin contenido de respuesta
    } catch (error) {
        next(error);
    }
});

module.exports = router;