"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 4173);
const PROVIDERS = Object.freeze({
  deepseek: "https://kilwaapi.vercel.app/kilwa-deepseek",
  claude: "https://kilwaapi.vercel.app/kilwa-claude"
});
const MIME = Object.freeze({
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
});
const MAX_BODY_BYTES = 40_000;
const MAX_PROMPT_LENGTH = 8_000;
const MAX_PROVIDER_RESPONSE_BYTES = 1_000_000;
const MAX_CONCURRENT_PROVIDER_REQUESTS = 2;
let activeProviderRequests = 0;

function sendJson(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    let tooLarge = false;
    req.on("data", chunk => {
      if (tooLarge) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        reject(Object.assign(new Error("Request body is too large."), { status: 413 }));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (tooLarge) return;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("Request must be valid JSON."), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

async function callProviderUrl(endpoint, prompt, clientSignal) {
  const url = new URL(endpoint);
  url.searchParams.set("text", prompt);
  const timeout = AbortSignal.timeout(30_000);
  const signal = AbortSignal.any([timeout, clientSignal]);
  const response = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json" },
    signal
  });
  if (!response.ok) {
    throw new Error(`Provider returned HTTP ${response.status}.`);
  }
  let data;
  try {
    const chunks = [];
    let size = 0;
    const reader = response.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_PROVIDER_RESPONSE_BYTES) {
          await reader.cancel();
          throw new Error("Provider response exceeded the 1 MB limit.");
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    data = JSON.parse(Buffer.concat(chunks.map(chunk => Buffer.from(chunk))).toString("utf8"));
  } catch (error) {
    if (error.message === "Provider response exceeded the 1 MB limit.") throw error;
    if (error.name === "TimeoutError" || error.name === "AbortError") throw error;
    throw new Error("Provider response was not valid JSON or could not be read.");
  }
  if (!data || data.status !== "success" ||
      typeof data.model !== "string" || !data.model.trim() ||
      typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("Provider response did not match the required success/model/reply schema.");
  }
  return { status: "success", model: data.model, reply: data.reply };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (req.method === "POST" && url.pathname === "/api/provider") {
    let body;
    try {
      body = await readJson(req);
    } catch (error) {
      if (!res.headersSent && !res.destroyed) {
        sendJson(res, error.status || 400, { status: "error", error: error.message });
      }
      return;
    }
    if (!body || typeof body.provider !== "string" ||
        !Object.hasOwn(PROVIDERS, body.provider) ||
        typeof body.prompt !== "string" || !body.prompt.trim() ||
        body.prompt.length > MAX_PROMPT_LENGTH) {
      sendJson(res, 400, {
        status: "error",
        error: `Choose an allowed provider and provide a non-empty prompt (maximum ${MAX_PROMPT_LENGTH} characters).`
      });
      return;
    }
    if (activeProviderRequests >= MAX_CONCURRENT_PROVIDER_REQUESTS) {
      res.setHeader("retry-after", "2");
      sendJson(res, 429, {
        status: "error",
        error: "The demo server is at its concurrent request limit. Retry shortly."
      });
      return;
    }

    const controller = new AbortController();
    let clientDisconnected = false;
    res.on("close", () => {
      if (!res.writableEnded) {
        clientDisconnected = true;
        controller.abort(new Error("Client cancelled the request."));
      }
    });
    activeProviderRequests++;
    try {
      const result = await callProviderUrl(PROVIDERS[body.provider], body.prompt, controller.signal);
      if (!clientDisconnected && !res.destroyed) sendJson(res, 200, result);
    } catch (error) {
      if (clientDisconnected || controller.signal.reason?.message === "Client cancelled the request.") return;
      const timedOut = error.name === "TimeoutError" || error.name === "AbortError" && controller.signal.aborted;
      sendJson(res, timedOut ? 504 : 502, {
        status: "error",
        error: timedOut ? "Provider request timed out after 30 seconds." : error.message || "Provider request failed."
      });
    } finally {
      activeProviderRequests--;
    }
    return;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { status: "error", error: "Method not allowed." });
    return;
  }
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = path.resolve(ROOT, `.${requested}`);
  if (!file.startsWith(`${ROOT}${path.sep}`) || !MIME[path.extname(file)]) {
    sendJson(res, 404, { status: "error", error: "Not found." });
    return;
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      sendJson(res, 404, { status: "error", error: "Not found." });
      return;
    }
    res.writeHead(200, { "content-type": MIME[path.extname(file)], "x-content-type-options": "nosniff" });
    res.end(data);
  });
});

if (require.main === module) {
  server.listen(PORT, "127.0.0.1", () => {
    process.stdout.write(`AIGov Compass demo server listening at http://127.0.0.1:${PORT}\n`);
  });
} else {
  module.exports = {
    server
  };
}
