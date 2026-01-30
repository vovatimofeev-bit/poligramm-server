import express from "express";
import bodyParser from "body-parser";
import { analyzeMetrics } from "./analyzer.js";
import { generateTextReport } from "./textGenerator.js";
import { generatePDF } from "./pdf.js";
import { sendEmail } from "./mailer.js";

const app = express();

app.use(bodyParser.json({ limit: "2mb" }));

app.post("/api/submit", async (req, res) => {
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
      status: "ok",
      pdf: pdfPath
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// REQUIRED FOR VERCEL
export default app;
