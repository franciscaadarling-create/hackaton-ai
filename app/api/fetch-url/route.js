export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "URL requerida" }), { status: 400 });
    }

    let finalUrl = url;

    // Detect Google Docs URLs and try export format
    const docMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docMatch) {
      finalUrl = `https://docs.google.com/document/d/${docMatch[1]}/export?format=txt`;
    }

    const response = await fetch(finalUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EduQuizBot)" },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Error HTTP ${response.status} al acceder a la URL` }), { status: 400 });
    }

    const contentType = response.headers.get("content-type") || "";
    let text;

    if (contentType.includes("text/plain")) {
      text = await response.text();
    } else {
      const html = await response.text();
      text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/&[^;]+;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    return new Response(JSON.stringify({ text }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
