export const maxDuration = 60;

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
      const { PDFParse } = await import("pdf-parse");
      let pdf;
      try {
        pdf = new PDFParse({ data: buffer });
        const result = await pdf.getText();
        text = result.text || "";
        if (!text.trim()) return new Response(JSON.stringify({ error: "No se pudo extraer texto del PDF. Puede que sea un PDF escaneado (solo imágenes)." }), { status: 400 });
      } catch (pdfErr) {
        return new Response(JSON.stringify({ error: "Error al leer el PDF: " + pdfErr.message + ". Asegúrate de que sea un PDF con texto seleccionable." }), { status: 500 });
      } finally {
        try { if (pdf) await pdf.destroy(); } catch {}
      }
    } else if (/\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(lowerName)) {
      const Tesseract = await import("tesseract.js");
      try {
        const { data: ocrData } = await Tesseract.default.recognize(buffer, "spa", { logger: () => {} });
        text = ocrData.text || "";
        if (!text.trim()) return new Response(JSON.stringify({ error: "No se pudo reconocer texto en la imagen. Asegúrate de que tenga texto visible y nítido." }), { status: 400 });
      } catch (ocrErr) {
        return new Response(JSON.stringify({ error: "Error de OCR: " + ocrErr.message + ". Intenta con un archivo .txt o .pdf." }), { status: 500 });
      }
    } else {
      return new Response(JSON.stringify({ error: "Formato no soportado. Usa .txt, .pdf o imágenes (.png, .jpg, etc.)." }), { status: 400 });
    }

    return new Response(JSON.stringify({ text: text.trim() }));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Error interno del servidor: " + e.message }), { status: 500 });
  }
}
