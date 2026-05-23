import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(helmet()); // Helmet is an Express middleware that adds security related HTTP headers to backend.
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app;
