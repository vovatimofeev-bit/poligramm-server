import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generatePDF(text) {
  return new Promise((resolve, reject) => {
    const reportsDir = "./reports";
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const filePath = path.join(
      reportsDir,
      `report_${Date.now()}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Заголовок
    doc.fontSize(18).text("Poligramm Test Report", { underline: true });
    doc.moveDown(1.5);

    // Если пришёл обычный текст — сохраняем старое поведение
    if (typeof text === "string") {
      doc.fontSize(12).text(text);
    }

    // Если пришёл объект — красиво форматируем
    if (typeof text === "object" && text !== null) {
      doc.fontSize(12);

      for (const section in text) {
        doc
          .moveDown(0.5)
          .fontSize(14)
          .text(section.toUpperCase(), { underline: true });

        const block = text[section];

        if (typeof block === "object") {
          for (const key in block) {
            doc
              .fontSize(12)
              .text(`${key}: ${JSON.stringify(block[key])}`);
          }
        } else {
          doc.text(String(block));
        }
      }
    }

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}
