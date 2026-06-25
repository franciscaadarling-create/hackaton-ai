import { getGroq } from "@/lib/groq";

export async function POST(req) {
  const { content, topic } = await req.json();

  const response = await getGroq().chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Eres un generador de quizzes educativos. Genera 5 preguntas de opción múltiple en formato JSON. Cada pregunta debe tener: question (string), options (array de 4 strings), correctIndex (number 0-3). Devuelve SOLO el JSON, sin explicaciones ni markdown.",
      },
      {
        role: "user",
        content: `Genera un quiz sobre: ${topic}\n\nBasado en este contenido:\n${content}`,
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  let quiz;
  try {
    quiz = JSON.parse(response.choices[0].message.content);
  } catch {
    quiz = { error: "No se pudo generar el quiz. Intenta de nuevo." };
  }

  return new Response(JSON.stringify(quiz));
}
