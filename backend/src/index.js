require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDb } = require("./db");
const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "backend", timestamp: new Date().toISOString() });
});

app.use("/api", authRoutes);

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
});
