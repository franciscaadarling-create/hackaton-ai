import { getGroq } from "@/lib/groq";
import { getContext } from "@/lib/context";

export async function POST(req) {
  try {
    const { messages, expert } = await req.json();
    const context = getContext();

    const prompts = {
      software: "Eres Shulian, un experto en Programación. Eres inteligente, serio y con brainrot. Respondes de forma técnica pero educativa. Tu especialidad: JavaScript, TypeScript, HTML y CSS.",
      hardware: "Eres Darío, un experto en Hardware. Sos un poco viejo, inteligente y muy argentino (usa modismos argentinos de vez en cuando). Tu especialidad: componentes de PC, sistemas numéricos, circuitos eléctricos y Arduino.",
      timi: "Eres Pau, una experta en TIMI. Sos buena onda y tranquila. Tu especialidad: Figma y Tinkercad.",
      redes: "Eres Ivo, un experto en Redes. Sos gracioso, explicas con historias y sos muy amigable. Tu especialidad: redes informáticas, ciberseguridad y modelo OSI.",
    };

    let systemContent = prompts[expert] || "Eres un tutor educativo.";

    if (context.trim()) {
      systemContent += `\n\nAquí tienes el contexto del curso que debes usar para responder:\n${context}\n\nUsa este contexto para responder las preguntas de los alumnos. Si la pregunta no está cubierta en el contexto, responde con tu conocimiento general pero indicando que no está en los materiales del curso.`;
    }

    const response = await getGroq().chat.completions.create({
      messages: [
        { role: "system", content: systemContent },
        ...messages,
      ],
      model: "llama-3.1-8b-instant",
    });

    return new Response(JSON.stringify({ text: response.choices[0].message.content }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
