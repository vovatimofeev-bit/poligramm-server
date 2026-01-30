import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Poligramm Server Running");
});

export default app;
