import { PDFParse } from "pdf-parse";
import Tesseract from "tesseract.js";

export async function POST(req) {
  try {
    const { name, data } = await req.json();
    if (!name || !data) {
      return new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 });
    }

    const buffer = Buffer.from(data, "base64");
    const lowerName = name.toLowerCase();
    let text = "";

    if (lowerName.endsWith(".txt")) {
      text = buffer.toString("utf-8");
    } else if (lowerName.endsWith(".pdf")) {
      const pdf = new PDFParse({ data: buffer });
      const result = await pdf.getText();
      text = result.text;
      await pdf.destroy();
    } else if (/\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(lowerName)) {
      const { data: ocrData } = await Tesseract.recognize(buffer, "spa");
      text = ocrData.text;
    } else {
      return new Response(JSON.stringify({ error: "Formato no soportado. Usa .txt, .pdf o imágenes." }), { status: 400 });
    }

    return new Response(JSON.stringify({ text: text.trim() }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
