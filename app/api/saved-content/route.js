import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "saved-content.json");

async function readContent() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeContent(items) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function GET() {
  const items = await readContent();
  return new Response(JSON.stringify(items));
}

export async function POST(req) {
  const { topic, content } = await req.json();
  if (!topic || !content) {
    return new Response(JSON.stringify({ error: "Faltan topic y content" }), { status: 400 });
  }
  const items = await readContent();
  const item = { id: Date.now(), topic, content, date: new Date().toLocaleString() };
  items.push(item);
  await writeContent(items);
  return new Response(JSON.stringify(item));
}

export async function DELETE(req) {
  const { id } = await req.json();
  let items = await readContent();
  items = items.filter((i) => i.id !== id);
  await writeContent(items);
  return new Response(JSON.stringify({ ok: true }));
}
