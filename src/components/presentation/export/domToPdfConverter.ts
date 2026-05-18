import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";

export async function exportPresentationToPdf(
  slides: PlateSlide[],
  title: string,
): Promise<Blob> {
  const { default: html2canvas } = await import("html2canvas-pro");
  const { PDFDocument } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.create();
  const slideW = 1920;
  const slideH = 1080;

  for (const slide of slides) {
    const el = document.querySelector(`#presentation-root-${slide.id}`);
    if (!el) continue;

    const canvas = await html2canvas(el as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
    });

    const dataUrl = canvas.toDataURL("image/png");
    const image = await pdfDoc.embedPng(dataUrl);

    const page = pdfDoc.addPage([slideW, slideH]);
    const scaledH = (image.height / image.width) * slideW;

    page.drawImage(image, {
      x: 0,
      y: (slideH - scaledH) / 2,
      width: slideW,
      height: scaledH,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
}
