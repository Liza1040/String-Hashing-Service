const fs = require('fs');
const path = require('path');
const db = require('./db');

const sqlPath = path.join(__dirname, 'create_tables.sql');
const sql = fs.readFileSync(sqlPath, { encoding: 'utf-8' });

db.query(sql)
    .then(() => {
        console.log('Миграция выполнена – таблица audit_logs создана');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Ошибка при выполнении миграции:', err);
        process.exit(1);
    });
