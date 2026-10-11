import type { PageText } from "./docstore";

// Call only in the browser; pdf.js is loaded lazily.
export async function extractPdf(
  file: File,
  onPage: (done: number, total: number) => void,
): Promise<PageText[]> {
  const pdfjs = await import("pdfjs-dist");
  const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: PageText[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let text = "";
    for (const item of content.items) {
      if ("str" in item) text += item.str + (item.hasEOL ? "\n" : " ");
    }
    text = text.replace(/[ \t]+/g, " ").trim();
    pages.push({ page: i, text, chars: text.length });
    onPage(i, pdf.numPages);
  }
  return pages;
}
