const express = require('express');
const crypto = require("crypto");
const cors = require('cors');
const Joi = require("joi");
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[INFO] ${now} ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    next();
});

// Схема валидации входящих данных с использованием Joi
const hashSchema = Joi.object({
    input: Joi.string().required().messages({
        "any.required": "Поле 'input' обязательно для передачи",
        "string.base": "'input' должно быть строкой"
    }),
    algorithm: Joi.string().valid("md5", "sha1", "sha256").required().messages({
        "any.only": "Поддерживаются только алгоритмы md5, sha1 и sha256",
        "any.required": "Поле 'algorithm' обязательно для передачи"
    })
});

function generateHash(input, algorithm) {
    return crypto.createHash(algorithm).update(input).digest("hex");
}

async function logEvent(user, operation, meta) {
    const query = `INSERT INTO audit_logs (user_id, operation, meta) VALUES ($1, $2, $3)`;
    try {
        await pool.query(query, [user || null, operation, meta]);
        console.log(
            `[AUDIT] [${operation}] Пользователь: ${user || "anonymous"} | meta: ${JSON.stringify(meta)}`
        );
    } catch (error) {
        console.error("Ошибка записи в аудит-лог:", error);
    }
}

app.get('/', (req, res) => {
    res.send('Backend работает');
});

app.post("/login", async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).json({ error: "user_id обязателен для входа" });
    }
    await logEvent(user_id, "login", {
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    res.json({ message: "Пользователь вошёл в систему", user_id });
});

app.post("/logout", async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).json({ error: "user_id обязателен для выхода" });
    }
    await logEvent(user_id, "logout", {
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    res.json({ message: "Пользователь вышел из системы", user_id });
});

// Эндпоинт POST /hash
app.post("/hash", async (req, res) => {
    const { error, value } = hashSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        await logEvent(value?.user_id || null, "hash_validation_error", {
            ip: req.ip,
            errors,
            timestamp: new Date().toISOString()
        });
        return res.status(400).json({ errors });
    }

    const { input, algorithm, user_id } = value;

    try {
        const hashResult = generateHash(input, algorithm);
        await logEvent(user_id || null, "hash_generated", {
            ip: req.ip,
            endpoint: req.originalUrl,
            method: req.method,
            algorithm,
            timestamp: new Date().toISOString()
        });
        return res.json({
            input,
            algorithm,
            hash: hashResult
        });
    } catch (err) {
        console.error("Ошибка при вычислении хеша:", err);
        await logEvent(user_id || null, "hash_generation_error", {
            ip: req.ip,
            error: err.message,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend запущен на порту ${PORT}`);
});
