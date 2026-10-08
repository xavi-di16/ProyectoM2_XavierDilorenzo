const express = require('express');
const router = express.Router();
const authorService = require('../services/authorService');

// Regex estricta: parte local sin puntos al inicio/final ni consecutivos, dominio con TLD de 2+ letras
const EMAIL_REGEX = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*\.[a-zA-Z]{2,}$/;

const badRequest = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

// partial = true -> PUT: solo se validan los campos enviados (pero debe venir al menos uno)
const validateAuthor = (body, partial = false) => {
    // 1. VALIDACIÓN DEFENSIVA: Previene el Error 500 si el body es undefined o está vacío {}
    if (!body || Object.keys(body).length === 0) {
        throw badRequest('El cuerpo de la petición no puede estar vacío');
    }

    // 2. Ahora es completamente seguro desestructurar
    const { name, email, bio } = body;

    if (partial && name === undefined && email === undefined && bio === undefined) {
        throw badRequest('Debes enviar al menos un campo a actualizar: name, email o bio');
    }

    if (!partial || name !== undefined) {
        if (typeof name !== 'string' || name.trim().length < 3) {
            throw badRequest('El nombre es obligatorio y debe tener al menos 3 caracteres');
        }
        if (name.trim().length > 100) {
            throw badRequest('El nombre no puede superar los 100 caracteres');
        }
    }

    if (!partial || email !== undefined) {
        if (typeof email !== 'string' || email.trim() === '') {
            throw badRequest('El email es obligatorio');
        }
        if (!EMAIL_REGEX.test(email.trim())) {
            throw badRequest('El formato del email no es válido');
        }
    }

    if (bio !== undefined && bio !== null && typeof bio !== 'string') {
        throw badRequest('La bio debe ser un texto');
    }
};

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
router.get('/:id', validateId(), async (req, res, next) => {
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
        validateAuthor(req.body);
        const { name, email, bio } = req.body;

        const newAuthor = await authorService.createAuthor(
            name.trim(),
            email.trim().toLowerCase(),
            bio
        );
        res.status(201).json(newAuthor);
    } catch (error) {
        // Email único (Postgres 23505)
        if (error.code === '23505') {
            error.statusCode = 400;
            error.message = 'El email ya está registrado';
        }
        next(error);
    }
});

// PUT /authors/:id - Actualizar autor
router.put('/:id', validateId(), async (req, res, next) => {
    try {
        validateAuthor(req.body, true);
        const { name, email, bio } = req.body;

        const updatedAuthor = await authorService.updateAuthor(
            req.params.id,
            name !== undefined ? name.trim() : undefined,
            email !== undefined ? email.trim().toLowerCase() : undefined,
            bio
        );

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
router.delete('/:id', validateId(), async (req, res, next) => {
    try {
        const deletedAuthor = await authorService.deleteAuthor(req.params.id);
        if (!deletedAuthor) {
            const error = new Error('Autor no encontrado para eliminar');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            mensaje: `El autor '${deletedAuthor.name}' fue eliminado correctamente del sistema`,
            registro_eliminado: deletedAuthor
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
