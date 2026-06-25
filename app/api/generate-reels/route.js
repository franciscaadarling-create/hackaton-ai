import { getGroq } from "@/lib/groq";

function stripMarkdown(text) {
  return text.replace(/```(?:json)?\s*/gi, "").replace(/```\s*$/g, "").trim();
}

export async function POST(req) {
  try {
    const { content, topic } = await req.json();

    const prompt = `Genera 8 "reels" educativos cortos sobre el tema proporcionado, estilo YouTube Shorts.
Devuelve SOLAMENTE un objeto JSON, sin markdown ni explicaciones.
Formato: {"reels": [{"emoji": "emoji representativo", "title": "título corto y llamativo (max 6 palabras)", "content": "explicación breve y clara (2-3 oraciones)", "tip": "dato curioso o consejo útil (1 oración)"}]}
Cada reel debe ser autónomo, visualmente atractivo y cubrir un concepto distinto.
Ejemplo: {"reels":[{"emoji":"🧠","title":"¿Qué es una variable?","content":"Una variable es como una caja donde guardamos información en la memoria de la computadora. Puede almacenar números, texto u otros datos.","tip":"Las variables se llaman así porque su valor puede variar durante el programa."}]}`;

    const truncatedContent = content.length > 8000 ? content.substring(0, 8000) + "\n\n[contenido truncado]" : content;
    const response = await getGroq().chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Tema: ${topic}\n\nContenido:\n${truncatedContent}` },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 2048,
    });

    const raw = response.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(stripMarkdown(raw));
    } catch {
      parsed = { error: "No se pudieron generar los reels. Intenta de nuevo." };
    }

    return new Response(JSON.stringify(parsed));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
