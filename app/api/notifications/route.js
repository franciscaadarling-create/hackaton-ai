import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "notifications.json");

async function read() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function write(notifs) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(notifs, null, 2), "utf-8");
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userName = searchParams.get("userName");
  const all = await read();
  if (!userName) return new Response(JSON.stringify(all));
  const unread = all.filter((n) => !n.readBy?.includes(userName));
  return new Response(JSON.stringify(unread));
}

export async function POST(req) {
  const { quizId, topic, deadline, publishedAt } = await req.json();
  const all = await read();
  const notif = { id: Date.now(), quizId, topic, deadline, publishedAt, createdAt: new Date().toISOString(), readBy: [] };
  all.push(notif);
  await write(all);
  return new Response(JSON.stringify(notif));
}

export async function PUT(req) {
  const { notifId, userName } = await req.json();
  const all = await read();
  const n = all.find((x) => x.id === notifId);
  if (n) {
    if (!n.readBy) n.readBy = [];
    if (!n.readBy.includes(userName)) n.readBy.push(userName);
    await write(all);
  }
  return new Response(JSON.stringify({ ok: true }));
}
