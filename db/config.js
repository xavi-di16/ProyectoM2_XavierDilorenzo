const { Pool } = require('pg');

// Si existe DATABASE_URL (Railway), la usamos. Si no, usamos las variables locales.
const config = process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
    };

const pool = new Pool(config);

module.exports = pool;
