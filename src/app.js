import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routesjs";
import dataRoutes from "./routes/data.routes.js";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", dataRoutes);

export default app;
