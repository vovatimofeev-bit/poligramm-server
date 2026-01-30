import express from "express";
import bodyParser from "body-parser";
import { analyzeMetrics } from "./analyzer.js";
import { generateTextReport } from "./textGenerator.js";
import { generatePDF } from "./pdf.js";
import { sendEmail } from "./mailer.js";

const app = express();
app.use(bodyParser.json({ limit: "2mb" }));

app.post("/submit", async (req, res) => {
  try {
    const { email, metrics, version } = req.body;

    // Принимаем object или array метрик
    if (!metrics || typeof metrics !== "object") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Анализ метрик
    const analysis = analyzeMetrics(metrics);

    // Генерация текстового отчёта
    const textReport = generateTextReport(analysis, version);

    // Генерация PDF
    const pdfPath = await generatePDF(textReport);

    // Отправка PDF ТОЛЬКО владельцу проекта
    await sendEmail("bes8158@gmail.com", pdfPath);

    // Пользователь не получает PDF
    res.json({
      status: "ok"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default app;
