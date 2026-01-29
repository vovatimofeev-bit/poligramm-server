const express = require("express");
const { analyze } = require("./analyzer");
const { generatePDF } = require("./pdf");
const { sendReport } = require("./mailer");

const app = express();
app.use(express.json());

app.post("/submit", async (req, res) => {
  try {
    const { email, metrics } = req.body;

    const reportText = analyze(metrics);
    const pdfPath = generatePDF(reportText);
    await sendReport(email, pdfPath);

    res.json({
      status: "ok",
      email_sent: true,
      pdf: pdfPath
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "EMAIL_FAILED" });
  }
});

app.listen(3000, () =>
  console.log("SERVER OK → http://localhost:3000")
);
