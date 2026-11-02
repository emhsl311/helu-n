// Локален преглед:  node serve.mjs   →  http://localhost:4321
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(fileURLToPath(new URL(".", import.meta.url)), "dist");
const port = Number(process.env.PORT) || 4321;
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".xml": "application/xml", ".txt": "text/plain",
  ".json": "application/json", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json",
};

createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(dist, p);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { "content-type": types[".html"] });
    res.end(await readFile(join(dist, "404.html")).catch(() => "404"));
  }
}).listen(port, () => console.log(`→ http://localhost:${port}`));
