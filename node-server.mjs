import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";

const DIST_CLIENT = join(import.meta.dirname, "dist", "client");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

const mod = await import("./dist/server/server.js");
const handler = mod.default;

if (!handler?.fetch) {
  console.error("No fetch handler found in dist/server/server.js");
  console.error("Exports:", Object.keys(mod));
  process.exit(1);
}

async function serveStatic(pathname) {
  // Try exact match first, then index.html for directories
  const candidates = [join(DIST_CLIENT, pathname), join(DIST_CLIENT, pathname, "index.html")];
  for (const filePath of candidates) {
    try {
      const data = await readFile(filePath);
      const ext = extname(filePath).toLowerCase();
      const mime = MIME[ext] || "application/octet-stream";
      return { data, mime };
    } catch {
      // file doesn't exist, try next
    }
  }
  return null;
}

const server = createServer(async (nodeReq, nodeRes) => {
  try {
    const url = new URL(nodeReq.url, `http://${nodeReq.headers.host || "localhost"}`);

    // Try to serve static files first
    if (nodeReq.method === "GET" || nodeReq.method === "HEAD") {
      const staticFile = await serveStatic(url.pathname);
      if (staticFile) {
        nodeRes.writeHead(200, {
          "Content-Type": staticFile.mime,
          "Cache-Control": url.pathname.includes("/assets/")
            ? "public, max-age=31536000, immutable"
            : "public, max-age=0",
        });
        nodeRes.end(staticFile.data);
        return;
      }
    }

    // Fall through to SSR handler
    const headers = new Headers();
    for (const [key, value] of Object.entries(nodeReq.headers)) {
      if (value !== undefined) {
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    const init = { method: nodeReq.method, headers };

    if (nodeReq.method !== "GET" && nodeReq.method !== "HEAD") {
      const chunks = [];
      for await (const chunk of nodeReq) {
        chunks.push(chunk);
      }
      init.body = new Uint8Array(Buffer.concat(chunks));
    }

    const request = new Request(url.toString(), init);
    const response = await handler.fetch(request);

    nodeRes.writeHead(response.status, Object.fromEntries(response.headers));

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        nodeRes.write(Buffer.from(value));
      }
    }
    nodeRes.end();
  } catch (error) {
    console.error("Server error:", error);
    nodeRes.writeHead(500);
    nodeRes.end("Internal Server Error");
  }
});

const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log(`PellingCab server running on http://0.0.0.0:${port}`);
});
