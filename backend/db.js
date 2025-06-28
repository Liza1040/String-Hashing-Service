const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:01012002@localhost:5432/stringHashingDB',
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
