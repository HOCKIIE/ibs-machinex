import { createServer } from 'https';
import { parse } from 'url';
import next from 'next';
import fs from 'fs';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// โหลด SSL จาก mkcert
const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
};

app.prepare().then(() => {
    setInterval(() => {
        const used = process.memoryUsage();
        console.log({
            rss: (used.rss / 1024 / 1024).toFixed(2) + " MB",
            heapTotal: (used.heapTotal / 1024 / 1024).toFixed(2) + " MB",
            heapUsed: (used.heapUsed / 1024 / 1024).toFixed(2) + " MB",
            external: (used.external / 1024 / 1024).toFixed(2) + " MB",
        });
    }, 10000);
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    }).listen(3000, () => {
        console.log('✅ HTTPS Dev Server running at https://localhost:3000');
    });
});