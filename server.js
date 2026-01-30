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
    const { metrics, version } = req.body;

    if (!metrics || !Array.isArray(metrics)) {
      return res.status(400).json({ error: "Invalid metrics payload" });
    }

    console.log("Incoming metrics:", metrics.length);

    const analysis = analyzeMetrics(metrics);
    const textReport = generateTextReport(analysis, version);
    const pdfPath = await generatePDF(textReport);

    console.log("PDF generated:", pdfPath);

    // ⚠️ ЖЁСТКО: отправляем ТОЛЬКО тебе
    await sendEmail("bes8158@gmail.com", pdfPath);

    console.log("Email sent to owner");

    res.json({
      status: "ok"
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default app;
