import { analyzeMetrics } from "../analyzer.js";
import { generateTextReport } from "../textGenerator.js";
import { generatePDF } from "../pdf.js";
import { sendEmail } from "../mailer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, metrics, version } = req.body;

    if (!email || !metrics || !Array.isArray(metrics)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const analysis = analyzeMetrics(metrics);
    const textReport = generateTextReport(analysis, version);
    const pdfPath = await generatePDF(textReport);

    await sendEmail(email, pdfPath);

    return res.json({
      status: "ok"
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
