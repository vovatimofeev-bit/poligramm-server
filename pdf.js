const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generatePDF(reportText) {
  const reportsDir = path.join(__dirname, "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

  const filePath = path.join(
    reportsDir,
    `report_${Date.now()}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  reportText.split("\n\n").forEach((block, index) => {
    if (index > 0) doc.addPage();
    doc.fontSize(14).text(block, { align: "left" });
  });

  doc.end();
  return filePath;
}

module.exports = { generatePDF };
