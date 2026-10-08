-- Borramos las tablas si ya existen para poder ejecutar el script varias veces limpiamente
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS authors;

-- Tabla de Autores
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Posts
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Tabla de Comentarios (Extra Credit)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Datos de prueba (Seed)
INSERT INTO authors (name, email, bio) VALUES
('Ana García', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'),
('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos');

INSERT INTO posts (title, content, author_id, published) VALUES
('Introducción a Node.js', 'Node.js es un runtime de JavaScript...', 1, true),
('PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', 2, true);

INSERT INTO comments (content, post_id, author_id) VALUES
('¡Excelente artículo Ana!', 1, 2),
('Me sirvió mucho la comparación, gracias.', 2, 1);