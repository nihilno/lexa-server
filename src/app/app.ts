import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Express } from "express";
import { auth } from "../lib/auth.js";
import { router as InvoiceRouter } from "./routes/invoice-router.js";

export const app: Express = express();

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL environment variable is required");
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL!,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.all("/api/auth/{*splat}", toNodeHandler(auth));
app.use(express.json());

app.use("/api/invoices", InvoiceRouter);
