import { PDFParse } from "pdf-parse";
import Tesseract from "tesseract.js";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { name, data } = await req.json();
    if (!name || !data) {
      return new Response(JSON.stringify({ error: "Faltan datos (name y data requeridos)" }), { status: 400 });
    }

    if (data.length > 15 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "El archivo es demasiado grande (máx 15MB en base64)" }), { status: 400 });
    }

    const buffer = Buffer.from(data, "base64");
    const lowerName = name.toLowerCase();
    let text = "";

    if (lowerName.endsWith(".txt")) {
      text = buffer.toString("utf-8");
      if (!text.trim()) return new Response(JSON.stringify({ error: "El archivo de texto está vacío" }), { status: 400 });
    } else if (lowerName.endsWith(".pdf")) {
      try {
        const pdf = new PDFParse({ data: buffer });
        const result = await pdf.getText();
        text = result.text || "";
        await pdf.destroy();
        if (!text.trim()) return new Response(JSON.stringify({ error: "No se pudo extraer texto del PDF. Puede que sea un PDF escaneado (solo imágenes)." }), { status: 400 });
      } catch (pdfErr) {
        return new Response(JSON.stringify({ error: "Error al procesar el PDF: " + pdfErr.message }), { status: 500 });
      }
    } else if (/\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(lowerName)) {
      try {
        const { data: ocrData } = await Tesseract.recognize(buffer, "spa");
        text = ocrData.text || "";
        if (!text.trim()) return new Response(JSON.stringify({ error: "No se pudo reconocer texto en la imagen. Asegúrate de que tenga texto visible." }), { status: 400 });
      } catch (ocrErr) {
        return new Response(JSON.stringify({ error: "Error de OCR: " + ocrErr.message }), { status: 500 });
      }
    } else {
      return new Response(JSON.stringify({ error: "Formato no soportado. Usa .txt, .pdf o imágenes (.png, .jpg, etc.)." }), { status: 400 });
    }

    return new Response(JSON.stringify({ text: text.trim() }));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Error interno: " + e.message }), { status: 500 });
  }
}
