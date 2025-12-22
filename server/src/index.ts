import express from 'express';
import env from './config/env.js';

const app = express();
const port = env.port;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});