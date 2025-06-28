const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Backend работает');
});

app.listen(PORT, () => {
    console.log(`Backend запущен на порту ${PORT}`);
});
