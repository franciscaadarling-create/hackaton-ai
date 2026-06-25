import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "context.json");
let cached = {};

function loadSync() {
  try {
    const raw = require("fs").readFileSync(DATA_FILE, "utf-8");
    cached = JSON.parse(raw) || {};
  } catch {
    cached = {};
  }
}

async function load() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    cached = JSON.parse(raw) || {};
  } catch {
    cached = {};
  }
}

async function save(data) {
  cached = data;
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data), "utf-8");
}

loadSync();

export function getContext(professorId) {
  return (cached && cached[professorId]) || "";
}

export async function setContext(professorId, text) {
  const data = { ...cached, [professorId]: text };
  await save(data);
}

export async function reloadContext() {
  await load();
}

export function getAllContexts() {
  return cached || {};
}
