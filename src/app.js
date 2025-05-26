import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import dataRoutes from "./routes/data.routes.js";

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

export default app;
