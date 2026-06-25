import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "chat-history.json");

async function readAll() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeAll(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data), "utf-8");
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userName = searchParams.get("userName");
  const professorId = searchParams.get("professorId");
  if (!userName || !professorId) {
    return new Response(JSON.stringify({ error: "Faltan parámetros" }), { status: 400 });
  }
  const all = await readAll();
  const key = `${userName}::${professorId}`;
  return new Response(JSON.stringify({ messages: all[key] || [] }));
}

export async function POST(req) {
  const { userName, professorId, messages } = await req.json();
  if (!userName || !professorId || !messages) {
    return new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 });
  }
  const all = await readAll();
  all[`${userName}::${professorId}`] = messages;
  await writeAll(all);
  return new Response(JSON.stringify({ success: true }));
}
