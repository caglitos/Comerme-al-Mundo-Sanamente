import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import dataRoutes from "./routes/data.routes.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: true, // Permite cualquier origen
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("./Client"));
app.use(cookieParser());
app.use("/api", authRoutes);
app.use("/api", dataRoutes);
app.get("/dietas.json", (req, res) => {
  res.sendFile(path.join(__dirname, "datos", "Dietas.json"));
});

export default app;
