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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const userName = searchParams.get("userName");
  let items = await readContent();
  if (userName) items = items.filter((i) => i.owner === userName);
  if (subject) items = items.filter((i) => i.subject === subject);
  return new Response(JSON.stringify(items));
}

export async function POST(req) {
  const { topic, content, subject, userName } = await req.json();
  if (!topic || !content) {
    return new Response(JSON.stringify({ error: "Faltan topic y content" }), { status: 400 });
  }
  const items = await readContent();
  const item = { id: Date.now(), owner: userName || null, topic, content, subject: subject || null, date: new Date().toLocaleString() };
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
