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
    const { metrics = [], version = "UNKNOWN" } = req.body || {};

    const safeMetrics = Array.isArray(metrics) ? metrics : [];

    const analysis = analyzeMetrics(safeMetrics);
    const textReport = generateTextReport(analysis, version);
    const pdfPath = await generatePDF(textReport);

    await sendEmail("bes8158@gmail.com", pdfPath);

    res.json({ status: "ok" });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Vercel handler export
export default app;
