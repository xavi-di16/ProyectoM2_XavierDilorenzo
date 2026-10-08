const pool = require('../db/config');

// Listar todos los comentarios (NUEVO)
const getAllComments = async () => {
    const result = await pool.query('SELECT * FROM comments ORDER BY created_at ASC');
    return result.rows;
};

// Listar comentarios de un post específico
const getCommentsByPost = async (postId) => {
    const result = await pool.query(
        'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC',
        [postId]
    );
    return result.rows;
};

// Crear un comentario
const createComment = async (content, post_id, author_id) => {
    const result = await pool.query(
        'INSERT INTO comments (content, post_id, author_id) VALUES ($1, $2, $3) RETURNING *',
        [content, post_id, author_id]
    );
    return result.rows[0];
};

module.exports = {
    getAllComments,
    getCommentsByPost,
    createComment
};