#!/usr/bin/env node
import { createServer } from "node:http";
import { randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const BRIDGE_NAME = "flashtotype-codex-bridge";
const BRIDGE_VERSION = 1;
const LOOPBACK_HOST = "127.0.0.1";
const DEFAULT_PORT = 4777;
const DEFAULT_PROVIDER = "exec";
const DEFAULT_SANDBOX = "read-only";
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_PROMPT_CHARS = 120000;
const MAX_EVENTS_PER_RUN = 300;
const ALLOWED_PROVIDERS = new Set(["exec", "app-server"]);
const ALLOWED_SANDBOXES = new Set(["read-only", "workspace-write"]);

const options = parseArgs(process.argv.slice(2));
const token = options.token || process.env.FLASHTOTYPE_CODEX_TOKEN || randomBytes(24).toString("base64url");
const runs = new Map();

if (options.help) {
  printHelp();
  process.exit(0);
}

const server = createServer(async (request, response) => {
  try {
    if (!isCorsAllowed(request.headers.origin)) {
      sendJson(request, response, 403, { error: "Origin is not allowed." });
      return;
    }

    if (request.method === "OPTIONS") {
      sendEmpty(request, response, 204);
      return;
    }

    const url = new URL(request.url || "/", `http://${LOOPBACK_HOST}:${options.port}`);
    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(request, response, 200, healthPayload());
      return;
    }

    if (!isAuthorized(request)) {
      sendJson(request, response, 401, { error: "Missing or invalid bridge token." });
      return;
    }

    if (request.method === "POST" && url.pathname === "/runs") {
      const body = await readJsonBody(request);
      const run = startRun(body);
      sendJson(request, response, 202, publicRun(run));
      return;
    }

    const runMatch = url.pathname.match(/^\/runs\/([^/]+)(?:\/(cancel))?$/);
    if (runMatch && request.method === "GET" && !runMatch[2]) {
      const run = runs.get(runMatch[1]);
      if (!run) {
        sendJson(request, response, 404, { error: "Run not found." });
        return;
      }
      sendJson(request, response, 200, publicRun(run));
      return;
    }

    if (runMatch && request.method === "POST" && runMatch[2] === "cancel") {
      const run = runs.get(runMatch[1]);
      if (!run) {
        sendJson(request, response, 404, { error: "Run not found." });
        return;
      }
      cancelRun(run);
      sendJson(request, response, 202, publicRun(run));
      return;
    }

    sendJson(request, response, 404, { error: "Route not found." });
  } catch (error) {
    sendJson(request, response, 500, { error: error.message || "Bridge error." });
  }
});

server.listen(options.port, LOOPBACK_HOST, () => {
  console.log(`${BRIDGE_NAME} listening on http://${LOOPBACK_HOST}:${options.port}`);
  console.log(`Token: ${token}`);
  console.log("Keep this terminal open. If the board reports an invalid token, restart the bridge from the board connection command.");
});

function parseArgs(args) {
  const parsed = {
    codexBin: "codex",
    defaultProvider: DEFAULT_PROVIDER,
    defaultSandbox: DEFAULT_SANDBOX,
    port: DEFAULT_PORT,
    cwd: process.cwd(),
    token: ""
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const [name, inlineValue] = arg.split("=", 2);
    const value = inlineValue ?? args[index + 1];
    const consume = inlineValue === undefined;

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (name === "--port") {
      parsed.port = sanitizePort(value);
      if (consume) index += 1;
    } else if (name === "--codex-bin") {
      parsed.codexBin = String(value || "codex");
      if (consume) index += 1;
    } else if (name === "--provider") {
      parsed.defaultProvider = sanitizeProvider(value);
      if (consume) index += 1;
    } else if (name === "--sandbox") {
      parsed.defaultSandbox = sanitizeSandbox(value);
      if (consume) index += 1;
    } else if (name === "--cwd") {
      parsed.cwd = resolve(String(value || process.cwd()));
      if (consume) index += 1;
    } else if (name === "--token") {
      parsed.token = String(value || "");
      if (consume) index += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return parsed;
}

function printHelp() {
  console.log(`Usage: node flashtotype-codex-bridge.mjs [options]

Options:
  --port <port>          Local port. Defaults to ${DEFAULT_PORT}.
  --codex-bin <path>     Codex executable or wrapper. Defaults to "codex".
  --provider <provider>  Default provider: exec or app-server. Defaults to exec.
  --sandbox <mode>       Default sandbox: read-only or workspace-write. Defaults to read-only.
  --cwd <path>           Default Codex working directory. Defaults to the current directory.
  --token <token>        Optional fixed token. Defaults to a random token printed at startup.
`);
}

function sanitizePort(value) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error("Port must be an integer from 1024 to 65535.");
  }
  return port;
}

function sanitizeProvider(value) {
  const provider = String(value || DEFAULT_PROVIDER).trim();
  return ALLOWED_PROVIDERS.has(provider) ? provider : DEFAULT_PROVIDER;
}

function sanitizeSandbox(value) {
  const sandbox = String(value || DEFAULT_SANDBOX).trim();
  return ALLOWED_SANDBOXES.has(sandbox) ? sandbox : DEFAULT_SANDBOX;
}

function healthPayload() {
  return {
    ok: true,
    name: BRIDGE_NAME,
    version: BRIDGE_VERSION,
    providers: Array.from(ALLOWED_PROVIDERS),
    defaultProvider: options.defaultProvider,
    defaultSandbox: options.defaultSandbox,
    allowedSandboxes: Array.from(ALLOWED_SANDBOXES)
  };
}

function isCorsAllowed(origin) {
  if (!origin || origin === "null") return true;
  try {
    const url = new URL(origin);
    return ["http:", "https:"].includes(url.protocol)
      && ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname);
  } catch {
    return false;
  }
}

function setCorsHeaders(request, response) {
  const origin = request.headers.origin;
  response.setHeader("Access-Control-Allow-Origin", origin && isCorsAllowed(origin) ? origin : "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Flashtotype-Token");
  response.setHeader("Access-Control-Max-Age", "600");
  response.setHeader("Vary", "Origin");
}

function sendEmpty(request, response, status) {
  setCorsHeaders(request, response);
  response.writeHead(status);
  response.end();
}

function sendJson(request, response, status, payload) {
  setCorsHeaders(request, response);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function tokenFromRequest(request) {
  const auth = String(request.headers.authorization || "");
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return String(request.headers["x-flashtotype-token"] || "").trim();
}

function isAuthorized(request) {
  const provided = tokenFromRequest(request);
  if (!provided) return false;
  const expectedBuffer = Buffer.from(token);
  const providedBuffer = Buffer.from(provided);
  if (expectedBuffer.length !== providedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, providedBuffer);
}

function readJsonBody(request) {
  return new Promise((resolveBody, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        request.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    request.on("end", () => {
      try {
        resolveBody(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function startRun(body) {
  const prompt = String(body?.prompt || "").trim();
  if (!prompt) throw new Error("Prompt is required.");
  if (prompt.length > MAX_PROMPT_CHARS) throw new Error(`Prompt must be ${MAX_PROMPT_CHARS} characters or fewer.`);

  const run = {
    id: randomUUID(),
    status: "queued",
    provider: sanitizeProvider(body?.provider || options.defaultProvider),
    sandbox: sanitizeSandbox(body?.sandbox || options.defaultSandbox),
    cwd: resolve(String(body?.cwd || options.cwd)),
    prompt,
    events: [],
    finalMessage: "",
    error: "",
    startedAt: new Date().toISOString(),
    completedAt: "",
    child: null,
    appServer: null
  };

  runs.set(run.id, run);
  pruneRuns();

  if (run.provider === "app-server") {
    startAppServerRun(run);
  } else {
    startExecRun(run);
  }

  return run;
}

function pruneRuns() {
  const ids = Array.from(runs.keys());
  while (ids.length > 50) {
    runs.delete(ids.shift());
  }
}

function pushEvent(run, event) {
  run.events.push({
    at: new Date().toISOString(),
    ...event
  });
  if (run.events.length > MAX_EVENTS_PER_RUN) {
    run.events.splice(0, run.events.length - MAX_EVENTS_PER_RUN);
  }
}

function finishRun(run, status, error = "") {
  if (["completed", "failed", "cancelled"].includes(run.status)) return;
  run.status = status;
  run.error = error;
  run.completedAt = new Date().toISOString();
}

function startExecRun(run) {
  run.status = "running";
  const args = [
    "exec",
    "--json",
    "--sandbox",
    run.sandbox,
    "-c",
    'approval_policy="never"',
    "--cd",
    run.cwd,
    "-"
  ];
  const invocation = codexInvocation(args);
  const child = spawn(invocation.command, invocation.args, {
    cwd: run.cwd,
    windowsHide: true,
    stdio: ["pipe", "pipe", "pipe"]
  });
  run.child = child;
  child.stdin.end(run.prompt);

  readJsonLines(child.stdout, (event) => {
    pushEvent(run, { stream: "stdout", event });
    captureFinalMessage(run, event);
    if (event.type === "turn.completed") finishRun(run, "completed");
    if (event.type === "turn.failed" || event.type === "error") finishRun(run, "failed", event.message || event.error || "Codex run failed.");
  });

  child.stderr.on("data", (chunk) => {
    const text = String(chunk).trim();
    if (text) pushEvent(run, { stream: "stderr", text });
  });

  child.on("error", (error) => finishRun(run, "failed", error.message));
  child.on("close", (code) => {
    if (run.status === "cancelled") return;
    if (code === 0) finishRun(run, run.status === "completed" ? "completed" : "completed");
    else finishRun(run, "failed", `Codex exited with code ${code}.`);
  });
}

function startAppServerRun(run) {
  run.status = "running";
  const args = [
    "app-server",
    "-c",
    `sandbox_mode="${run.sandbox}"`,
    "-c",
    'approval_policy="never"'
  ];
  const invocation = codexInvocation(args);
  const child = spawn(invocation.command, invocation.args, {
    cwd: run.cwd,
    windowsHide: true,
    stdio: ["pipe", "pipe", "pipe"]
  });
  run.child = child;
  run.appServer = { nextId: 1, threadId: "" };

  const send = (message) => {
    if (!child.stdin.destroyed) child.stdin.write(`${JSON.stringify(message)}\n`);
  };
  const sendRequest = (method, params) => {
    const id = run.appServer.nextId;
    run.appServer.nextId += 1;
    send({ method, id, params });
    return id;
  };

  const threadStartId = 2;
  send({
    method: "initialize",
    id: 1,
    params: {
      clientInfo: {
        name: "flashtotype_codex_bridge",
        title: "Flashtotype Codex Bridge",
        version: String(BRIDGE_VERSION)
      },
      capabilities: {
        experimentalApi: true
      }
    }
  });
  send({ method: "initialized", params: {} });
  send({ method: "thread/start", id: threadStartId, params: {} });
  run.appServer.nextId = 3;

  readJsonLines(child.stdout, (message) => {
    pushEvent(run, { stream: "stdout", event: message });
    captureFinalMessage(run, message);

    if (message.id === threadStartId && message.result?.thread?.id) {
      run.appServer.threadId = message.result.thread.id;
      sendRequest("turn/start", {
        threadId: run.appServer.threadId,
        input: [{ type: "text", text: run.prompt }],
        cwd: run.cwd,
        sandboxMode: run.sandbox,
        approvalPolicy: "never"
      });
    }

    if (message.error) {
      finishRun(run, "failed", message.error.message || "Codex app-server error.");
    }
    if (message.method === "turn/completed") finishRun(run, "completed");
    if (message.method === "turn/failed") finishRun(run, "failed", message.params?.message || "Codex turn failed.");
  });

  child.stderr.on("data", (chunk) => {
    const text = String(chunk).trim();
    if (text) pushEvent(run, { stream: "stderr", text });
  });

  child.on("error", (error) => finishRun(run, "failed", error.message));
  child.on("close", (code) => {
    if (run.status === "cancelled") return;
    if (code !== 0 && !run.completedAt) finishRun(run, "failed", `Codex app-server exited with code ${code}.`);
    else if (!run.completedAt) finishRun(run, "completed");
  });
}

function codexInvocation(args) {
  if (process.platform === "win32" && /\.ps1$/i.test(options.codexBin)) {
    const binDir = dirname(options.codexBin);
    const codexJs = join(binDir, "node_modules", "@openai", "codex", "bin", "codex.js");
    const localNode = join(binDir, "node.exe");
    if (existsSync(codexJs)) {
      return {
        command: existsSync(localNode) ? localNode : "node.exe",
        args: [codexJs, ...args]
      };
    }
    return {
      command: "powershell.exe",
      args: ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", options.codexBin, ...args]
    };
  }
  return {
    command: options.codexBin,
    args
  };
}

function readJsonLines(stream, onJson) {
  const reader = createInterface({ input: stream });
  reader.on("line", (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      onJson(JSON.parse(trimmed));
    } catch {
      onJson({ type: "raw", text: trimmed });
    }
  });
}

function captureFinalMessage(run, event) {
  const item = event.item || event.params?.item;
  if (item?.type === "agent_message" && typeof item.text === "string") {
    run.finalMessage = item.text;
  }
  if (event.method === "item/agentMessage/delta" && typeof event.params?.delta === "string") {
    run.finalMessage += event.params.delta;
  }
}

function cancelRun(run) {
  if (["completed", "failed", "cancelled"].includes(run.status)) return;
  finishRun(run, "cancelled", "Cancelled by user.");
  if (run.child && !run.child.killed) {
    if (run.provider === "app-server" && run.appServer?.threadId && !run.child.stdin.destroyed) {
      run.child.stdin.write(JSON.stringify({
        method: "turn/interrupt",
        id: run.appServer.nextId,
        params: { threadId: run.appServer.threadId }
      }) + "\n");
    }
    setTimeout(() => {
      if (run.child && !run.child.killed) run.child.kill();
    }, 200);
  }
}

function publicRun(run) {
  return {
    id: run.id,
    status: run.status,
    provider: run.provider,
    sandbox: run.sandbox,
    cwd: run.cwd,
    events: run.events,
    finalMessage: run.finalMessage,
    error: run.error,
    startedAt: run.startedAt,
    completedAt: run.completedAt
  };
}
