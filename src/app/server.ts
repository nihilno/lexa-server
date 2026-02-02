import { config } from "dotenv";
config();

import { PORT } from "../constants/index.js";
import { disconnectDB } from "../lib/prisma.js";
import { app } from "./app.js";

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught exception:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
