const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgres://postgres:01012002@db:5432/stringHashingDB',
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
