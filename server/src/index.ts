import { startServer } from './app/index.js';
import env from './config/env.js';

async function init() {
    const app = await startServer();
    const port = env.port;

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

init();