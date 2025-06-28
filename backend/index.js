const express = require('express');
const crypto = require("crypto");
const Joi = require("joi");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

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

app.get('/', (req, res) => {
    res.send('Backend работает');
});

// Эндпоинт POST /hash
app.post("/hash", (req, res) => {
    const { error, value } = hashSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({ errors });
    }

    const { input, algorithm } = value;

    try {
        const hashResult = generateHash(input, algorithm);
        return res.json({
            input,
            algorithm,
            hash: hashResult
        });
    } catch (err) {
        console.error("Ошибка при вычислении хеша:", err);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend запущен на порту ${PORT}`);
});
