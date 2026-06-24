const results = [];

export async function POST(req) {
  const body = await req.json();
  results.push({ ...body, id: Date.now(), submittedAt: new Date().toISOString() });
  return new Response(JSON.stringify({ success: true }));
}

export async function GET() {
  return new Response(JSON.stringify(results));
}
