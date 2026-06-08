import http from "http";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { setupSocket } from "./socket";

const PORT = process.env.PORT || 8000;

const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  setupSocket(server);
  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
};

start();
