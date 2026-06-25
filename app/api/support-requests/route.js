import { promises as fs } from "fs";
import path from "path";
import { createNotification } from "@/lib/notifications";

const DATA_FILE = path.join(process.cwd(), "data", "support-requests.json");

async function read() {
  try { const raw = await fs.readFile(DATA_FILE, "utf-8"); return JSON.parse(raw); } catch { return []; }
}

async function write(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const teacherName = searchParams.get("teacherName");
  let requests = await read();
  if (teacherName) requests = requests.filter((r) => r.teacherName === teacherName);
  return new Response(JSON.stringify(requests));
}

export async function POST(req) {
  const body = await req.json();
  const requests = await read();
  const entry = {
    id: Date.now(),
    studentName: body.studentName,
    teacherName: body.teacherName,
    subject: body.subject || "",
    topic: body.topic,
    createdAt: new Date().toISOString(),
  };
  requests.push(entry);
  await write(requests);
  try {
    if (body.teacherName) {
      await createNotification({ type: "support_request", forUser: body.teacherName, studentName: body.studentName, subject: body.subject, topic: body.topic });
    }
  } catch {}
  return new Response(JSON.stringify(entry));
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));
  if (!id) return new Response(JSON.stringify({ error: "id requerido" }), { status: 400 });
  let requests = await read();
  requests = requests.filter((r) => r.id !== id);
  await write(requests);
  return new Response(JSON.stringify({ ok: true }));
}
