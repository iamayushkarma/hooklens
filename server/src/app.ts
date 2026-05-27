import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoute from "./routes/auth.routes";

const app = express();

app.use(helmet()); // Helmet is an Express middleware that adds security related HTTP headers to backend.
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// auth routes
app.use("/api/v1/auth", authRoute);

export default app;
