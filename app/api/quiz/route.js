import { getGroq } from "@/lib/groq";

function stripMarkdown(text) {
  return text.replace(/```(?:json)?\s*/gi, "").replace(/```\s*$/g, "").trim();
}

export async function POST(req) {
  try {
    const { content, topic, count = 5 } = await req.json();
    if (topic.length > 200) return new Response(JSON.stringify({ error: "El tema es demasiado largo" }));
    if (content.length > 15000) return new Response(JSON.stringify({ error: "El contenido es demasiado largo (máx 15000 caracteres)" }));

    const SYSTEM_PROMPT = [
      `Eres un generador de quizzes educativos de alta calidad.`,
      `Genera exactamente ${count} preguntas de opción múltiple.`,
      ``,
      `REGLAS IMPORTANTES:`,
      `1. Cada pregunta debe basarse ESTRICTAMENTE en el contenido proporcionado.`,
      `2. Las opciones incorrectas deben ser PLAUSIBLES y relacionadas con el tema.`,
      `3. Las preguntas deben evaluar comprensión, no solo memorización.`,
      `4. NO inventes información que no esté en el contenido.`,
      `5. Distribuye las respuestas correctas (no todas "a" o "d").`,
      `6. Varía la dificultad: algunas fáciles, otras más desafiantes.`,
      ``,
      `Devuelve SOLAMENTE un array JSON válido, sin markdown, sin etiquetas de código, sin texto adicional.`,
      `Cada elemento debe tener:`,
      `- "question": string clara y sin ambigüedad`,
      `- "options": array de 4 strings`,
      `- "correctIndex": número 0-3`,
      ``,
      `Ejemplo:`,
      `[{"question":"¿Qué es una variable en programación?","options":["Un valor que cambia","Un espacio de memoria con nombre","Un tipo de dato","Un bucle"],"correctIndex":1}]`,
    ].join("\n");

    const response = await getGroq().chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Tema: ${topic}\n\nContenido:\n${content}\n\nGenera ${count} preguntas de opción múltiple basadas en este contenido.` },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
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
