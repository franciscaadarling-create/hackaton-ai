import { getGroq } from "@/lib/groq";

function stripMarkdown(text) {
  return text.replace(/```(?:json)?\s*/gi, "").replace(/```\s*$/g, "").trim();
}

export async function POST(req) {
  try {
    const { content, topic, count = 5 } = await req.json();

    const response = await getGroq().chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            `Eres un generador de quizzes educativos. Genera ${count} preguntas de opción múltiple. Devuelve SOLAMENTE un array JSON, sin markdown ni explicaciones. Cada elemento del array debe ser un objeto con: question (string), options (array de 4 strings), correctIndex (number 0-3). Ejemplo: [{\"question\":\"...\",\"options\":[\"a\",\"b\",\"c\",\"d\"],\"correctIndex\":0}]`,
        },
        {
          role: "user",
          content: `Genera un quiz sobre: ${topic}\n\nBasado en este contenido:\n${content}`,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const raw = response.choices[0].message.content;
    let quiz;
    try {
      const parsed = JSON.parse(stripMarkdown(raw));
      if (Array.isArray(parsed)) {
        quiz = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        quiz = parsed.questions;
      } else if (parsed.quiz && Array.isArray(parsed.quiz)) {
        quiz = parsed.quiz;
      } else if (parsed.preguntas && Array.isArray(parsed.preguntas)) {
        quiz = parsed.preguntas;
      } else {
        quiz = { error: "El formato devuelto no es válido. Revisa el contenido e intenta de nuevo." };
      }
    } catch {
      quiz = { error: "No se pudo generar el quiz. Intenta de nuevo." };
    }

    return new Response(JSON.stringify(quiz));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
