const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

const publicDirectory = path.join(__dirname, 'public');

app.use(express.static(publicDirectory));

app.use((req, res) => {
    res.status(404).send('404: File Not Found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
