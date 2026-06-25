import { getGroq } from "@/lib/groq";

export async function POST(req) {
  try {
    const { messages, expert } = await req.json();

    const prompts = {
      software: "Eres un experto en Programación. Responde de forma técnica pero educativa.",
      hardware: "Eres un experto en Hardware. Habla sobre procesadores, RAM y componentes.",
      timi: "Eres un experto en TIMI. Ayuda con procesos de información.",
      redes: "Eres un experto en Redes. Habla sobre protocolos, IP y seguridad.",
    };

    const response = await getGroq().chat.completions.create({
      messages: [
        { role: "system", content: prompts[expert] || "Eres un tutor educativo." },
        ...messages,
      ],
      model: "llama-3.1-8b-instant",
    });

    return new Response(JSON.stringify({ text: response.choices[0].message.content }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
