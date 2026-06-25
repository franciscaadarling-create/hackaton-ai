import { getContext, setContext, reloadContext } from "@/lib/context";

export async function GET() {
  await reloadContext();
  return new Response(JSON.stringify({ text: getContext() }));
}

export async function POST(req) {
  const { text } = await req.json();
  await setContext(text);
  return new Response(JSON.stringify({ success: true }));
}
