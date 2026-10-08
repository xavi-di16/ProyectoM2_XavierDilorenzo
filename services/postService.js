const pool = require('../db/config');

const getAllPosts = async () => {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    return result.rows;
};

const getPostById = async (id) => {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0];
};

const getPostsByAuthor = async (authorId) => {
    const result = await pool.query('SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC', [authorId]);
    return result.rows;
};

const createPost = async (title, content, author_id, published) => {
    const result = await pool.query(
        'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, content, author_id, published || false]
    );
    return result.rows[0];
};

const updatePost = async (id, title, content, published) => {
    const result = await pool.query(
        'UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE($3, published) WHERE id = $4 RETURNING *',
        [title, content, published, id]
    );
    return result.rows[0];
};

const deletePost = async (id) => {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getAllPosts,
    getPostById,
    getPostsByAuthor,
    createPost,
    updatePost,
    deletePost
};