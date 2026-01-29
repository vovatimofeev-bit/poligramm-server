const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bes8158@gmail.com",
    pass: "cqmfqmtfaydeqlki"
  }
});

async function sendReport(email, pdfPath) {
  await transporter.sendMail({
    from: '"Poligram AI" <bes8158@gmail.com>',
    to: email,
    subject: "Ваш персональный Poligram-отчет",
    text: "Отчет во вложении. PDF с детальным анализом.",
    attachments: [
      {
        filename: "poligram-report.pdf",
        path: pdfPath
      }
    ]
  });
}

module.exports = { sendReport };
