const { WebSocketServer } = require("ws");
const { watch } = require("fs");
const { resolve } = require("path");

const PORT = 8234;
const DIR = resolve(__dirname);
const IGNORE = [".git", "node_modules", ".DS_Store"];

const wss = new WebSocketServer({ port: PORT });
const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});

function notifyAll() {
  for (const ws of clients) {
    ws.send("reload");
  }
}

let debounce = null;

watch(DIR, { recursive: true }, (_event, filename) => {
  if (!filename || IGNORE.some((i) => filename.includes(i))) return;
  if (filename === "dev.js" || filename === "reload.js") return;

  clearTimeout(debounce);
  debounce = setTimeout(() => {
    console.log(`Changed: ${filename} → reloading extension`);
    notifyAll();
  }, 300);
});

console.log(`Watching ${DIR} for changes (ws://localhost:${PORT})`);
