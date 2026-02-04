import cors from "cors";
import express, { type Express } from "express";
import { router as InvoiceRouter } from "./routes/invoice-router.js";

export const app: Express = express();
app.use(express.json());

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

app.use("/api/invoices", InvoiceRouter);
