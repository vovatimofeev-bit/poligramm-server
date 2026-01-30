import nodemailer from "nodemailer";

const OWNER_EMAIL = "bes8158@gmail.com";

export async function sendEmail(to, pdfPath) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Всегда отправляем только владельцу проекта
  await transporter.sendMail({
    from: `"Poligramm" <${process.env.SMTP_USER}>`,
    to: OWNER_EMAIL,
    subject: "Poligramm — новый отчет теста",
    text: "Отчет во вложении. Пользователь копию не получает.",
    attachments: [{ path: pdfPath }]
  });
}
