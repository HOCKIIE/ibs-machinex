"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
// โหลด SSL จาก mkcert
const httpsOptions = {
    key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../localhost-key.pem')),
    cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../localhost.pem')),
};
app.prepare().then(() => {
    (0, https_1.createServer)(httpsOptions, (req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(3000, () => {
        console.log('✅ HTTPS Dev Server running at https://localhost:3000');
    });
});
