// server.js
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: "./src" });
const handle = app.getRequestHandler();

async function start(req, res) {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
}

export default start;