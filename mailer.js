import nodemailer from "nodemailer";

export async function sendEmail(to, pdfPath) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  console.log("SMTP sending to:", to);

  await transporter.sendMail({
    from: `"Poligramm" <${process.env.SMTP_USER}>`,
    to,
    subject: "Poligramm Report",
    text: "PDF report attached",
    attachments: [{ path: pdfPath }]
  });
}
