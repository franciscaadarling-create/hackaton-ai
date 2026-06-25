import { getUnreadForUser, createNotification, markAsRead, getAll } from "@/lib/notifications";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userName = searchParams.get("userName");
  const role = searchParams.get("role") || "student";
  if (!userName) return new Response(JSON.stringify(await getAll()));
  const unread = await getUnreadForUser(userName, role);
  return new Response(JSON.stringify(unread));
}

export async function POST(req) {
  const data = await req.json();
  const notif = await createNotification(data);
  return new Response(JSON.stringify(notif));
}

export async function PUT(req) {
  const { notifId, userName } = await req.json();
  await markAsRead(notifId, userName);
  return new Response(JSON.stringify({ ok: true }));
}
