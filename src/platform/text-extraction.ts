/* ─────────────────────────────────────────────
   Client-side text extraction.
   - Text files: FileReader.readAsText()
   - PDF: dynamically imported pdf.js
   - Images: manual entry fallback (OCR future)
   ───────────────────────────────────────────── */

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  // Plain text files
  if (file.type === "text/plain" || name.endsWith(".txt") || name.endsWith(".md")) {
    return await file.text();
  }

  // PDF — use pdf.js (dynamic import to keep bundle small)
  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    try {
      const pdfjs = await import("pdfjs-dist");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const textParts: string[] = [];

      for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => (item.str ? item.str : ""))
          .join(" ");
        textParts.push(pageText);
      }

      return textParts.join("\n\n");
    } catch (err) {
      console.warn("PDF extraction failed, falling back to manual entry:", err);
      return "";
    }
  }

  // Images — would need OCR (tesseract.js), for now return empty
  if (file.type.startsWith("image/")) {
    return "";
  }

  return "";
}

/* Check if a file type is supported for text extraction */
export function isExtractable(file: File): boolean {
  return (
    file.type === "text/plain" ||
    file.type === "application/pdf" ||
    file.type.startsWith("image/") ||
    file.name.toLowerCase().endsWith(".txt") ||
    file.name.toLowerCase().endsWith(".md") ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

/* Check if a file needs OCR (image-based) */
export function needsOCR(file: File): boolean {
  return file.type.startsWith("image/");
}
