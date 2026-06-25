import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "notifications.json");

async function read() {
  try { const raw = await fs.readFile(DATA_FILE, "utf-8"); return JSON.parse(raw); } catch { return []; }
}

async function write(notifs) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(notifs, null, 2), "utf-8");
}

export async function createNotification(data) {
  const all = await read();
  const notif = { id: Date.now(), createdAt: new Date().toISOString(), readBy: [], ...data };
  all.push(notif);
  await write(all);
  return notif;
}

export async function getUnreadForUser(userName, role) {
  const all = await read();
  if (role === "teacher") {
    return all.filter((n) => n.forUser === userName && !n.readBy?.includes(userName));
  }
  return all.filter((n) => (!n.forUser || n.forUser === userName) && !n.readBy?.includes(userName));
}

export async function markAsRead(notifId, userName) {
  const all = await read();
  const n = all.find((x) => x.id === notifId);
  if (n) {
    if (!n.readBy) n.readBy = [];
    if (!n.readBy.includes(userName)) n.readBy.push(userName);
    await write(all);
  }
}

export async function getAll() {
  return read();
}
