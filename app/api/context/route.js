import { getContext, setContext, reloadContext, getAllContexts } from "@/lib/context";

export async function GET(req) {
  await reloadContext();
  const { searchParams } = new URL(req.url);
  const professorId = searchParams.get("professorId");
  if (professorId) {
    return new Response(JSON.stringify({ text: getContext(professorId) }));
  }
  return new Response(JSON.stringify(getAllContexts()));
}

export async function POST(req) {
  const { text, professorId } = await req.json();
  await setContext(professorId, text);
  return new Response(JSON.stringify({ success: true }));
}
