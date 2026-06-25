import { getGroq } from "@/lib/groq";

function stripMarkdown(text) {
  return text.replace(/```(?:json)?\s*/gi, "").replace(/```\s*$/g, "").trim();
}

const GAME_PROMPTS = {
  memory: `Genera 6 pares de conceptos para un juego de memoria educativo.
Devuelve SOLAMENTE un array JSON, sin markdown ni explicaciones.
Cada elemento: {"term": "concepto corto (1-3 palabras)", "definition": "definición corta (max 10 palabras)"}
Ejemplo: [{"term":"Variable","definition":"Espacio de memoria con nombre"}]`,

  hangman: `Genera 5 palabras para un juego del ahorcado educativo.
Devuelve SOLAMENTE un array JSON, sin markdown ni explicaciones.
Cada elemento: {"word": "palabra en MAYÚSCULAS (1 palabra, sin espacios)", "hint": "pista corta (max 10 palabras)"}
Ejemplo: [{"word":"VARIABLE","hint":"Espacio de memoria con nombre"}]`,

  wordsearch: `Genera 8 palabras para una sopa de letras educativa.
Devuelve SOLAMENTE un array JSON, sin markdown ni explicaciones.
Cada elemento: {"word": "palabra en MAYÚSCULAS (max 10 letras, sin espacios)", "hint": "pista corta (max 12 palabras)"}
Ejemplo: [{"word":"VARIABLE","hint":"Espacio de memoria con nombre"}]`,
};

export async function POST(req) {
  try {
    const { content, topic, type = "memory" } = await req.json();
    const prompt = GAME_PROMPTS[type] || GAME_PROMPTS.memory;

    const response = await getGroq().chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Tema: ${topic}\n\nContenido:\n${content}` },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
    });

    const raw = response.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(stripMarkdown(raw));
    } catch {
      parsed = { error: "No se pudo generar el juego. Intenta de nuevo." };
    }

    return new Response(JSON.stringify({ type, data: parsed }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
