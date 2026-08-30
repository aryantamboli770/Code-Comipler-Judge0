import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/version", (req, res) => {
  res.status(200).json({ version: process.env.APP_VERSION || "1.0.0" });
});

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
