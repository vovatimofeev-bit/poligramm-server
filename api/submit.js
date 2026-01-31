import { analyzeMetrics } from "../analyzer.js";
import { generateTextReport } from "../textGenerator.js";
import { generatePDF } from "../pdf.js";
import { sendEmail } from "../mailer.js";

export default async function handler(req, res) {
  // ✅ Разрешаем только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, metrics, version } = req.body;

    // ✅ Валидация входных данных
    if (!email || !metrics || !Array.isArray(metrics)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    console.log("📥 Incoming submit:", {
      email,
      version,
      metricsCount: metrics.length
    });

    // ✅ Анализ метрик
    const analysis = analyzeMetrics(metrics);

    // ✅ Генерация текстового отчёта
    const textReport = generateTextReport(analysis, version);

    // ✅ Генерация PDF
    const pdfPath = await generatePDF(textReport);

    // ✅ Отправка PDF ТОЛЬКО владельцу
    await sendEmail("bes8158@gmail.com", pdfPath);

    console.log("✅ PDF sent to owner:", pdfPath);

    return res.json({ status: "ok" });

  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
