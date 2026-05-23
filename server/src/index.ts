import http from "http";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
});
