import { createServer } from "node:http";

const mod = await import("./dist/server/server.js");
const handler = mod.default;

if (!handler?.fetch) {
  console.error("No fetch handler found in dist/server/server.js");
  console.error("Exports:", Object.keys(mod));
  process.exit(1);
}

const server = createServer(async (nodeReq, nodeRes) => {
  try {
    const url = new URL(nodeReq.url, `http://${nodeReq.headers.host || "localhost"}`);

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
