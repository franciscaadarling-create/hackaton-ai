import { getGroq } from "@/lib/groq";
import { getContext } from "@/lib/context";

const URL_REGEX = /https?:\/\/[^\s]+/g;

function extractUrls(text) {
  return text.match(URL_REGEX) || [];
}

async function fetchUrlContent(url) {
  try {
    let finalUrl = url;
    const docMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docMatch) {
      finalUrl = `https://docs.google.com/document/d/${docMatch[1]}/export?format=txt`;
    }
    const response = await fetch(finalUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EduQuizBot)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
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
    return text.substring(0, 8000);
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const { messages, expert } = await req.json();

    const context = getContext(expert);
    const prompts = {
      software: "Eres Shulian, un experto en Programación. Eres inteligente, serio y con brainrot. Respondes de forma técnica pero educativa. Tu especialidad: JavaScript, TypeScript, HTML y CSS.",
      hardware: "Eres Darío, un experto en Hardware. Sos un poco viejo, inteligente y muy argentino (usa modismos argentinos de vez en cuando). Tu especialidad: componentes de PC, sistemas numéricos, circuitos eléctricos y Arduino.",
      timi: "Eres Pau, una experta en TIMI. Sos buena onda y tranquila. Tu especialidad: Figma y Tinkercad.",
      redes: "Eres Ivo, un experto en Redes. Sos gracioso, explicas con historias y sos muy amigable. Tu especialidad: redes informáticas, ciberseguridad y modelo OSI.",
    };

    let systemContent = prompts[expert] || "Eres un tutor educativo.";

    if (context.trim()) {
      const truncated = context.length > 4000 ? context.substring(0, 4000) + "\n\n[contexto truncado por límite de tokens]" : context;
      systemContent += `\n\nAquí tienes el contexto del curso que debes usar para responder:\n${truncated}\n\nUsa este contexto para responder las preguntas de los alumnos. Si la pregunta no está cubierta en el contexto, responde con tu conocimiento general pero indicando que no está en los materiales del curso.`;
    }

    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === "user") {
      const urls = extractUrls(lastMsg.content);
      if (urls.length > 0) {
        const urlContents = [];
        for (const url of urls) {
          const content = await fetchUrlContent(url);
          if (content) {
            urlContents.push(`De ${url}:\n${content}`);
          }
        }
        if (urlContents.length > 0) {
          systemContent += `\n\nEl alumno ha compartido enlaces. Usa este contenido EXTRAÍDO para responder:\n${urlContents.join("\n\n---\n\n")}`;
        }
      }
    }

    const recentMessages = messages.length > 30 ? messages.slice(-30) : messages;
    const response = await getGroq().chat.completions.create({
      messages: [
        { role: "system", content: systemContent },
        ...recentMessages,
      ],
      model: "llama-3.1-8b-instant",
      max_tokens: 1024,
    });

    return new Response(JSON.stringify({ text: response.choices[0].message.content }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
