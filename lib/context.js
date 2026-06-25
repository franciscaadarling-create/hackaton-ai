import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "context.json");
let cached = null;

function loadSync() {
  try {
    const raw = require("fs").readFileSync(DATA_FILE, "utf-8");
    cached = JSON.parse(raw).text || "";
  } catch {
    cached = "";
  }
}

async function load() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    cached = JSON.parse(raw).text || "";
  } catch {
    cached = "";
  }
}

async function save(text) {
  cached = text;
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify({ text }), "utf-8");
}

// Sync load on module init so getContext() always returns data immediately
loadSync();

export function getContext() {
  return cached || "";
}

export async function setContext(text) {
  await save(text);
}

export async function reloadContext() {
  await load();
}
