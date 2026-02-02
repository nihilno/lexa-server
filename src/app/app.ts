import cors from "cors";
import { config } from "dotenv";
import express, { type Express } from "express";
import { router as InvoiceRouter } from "./routes/invoice-router.js";
config();

export const app: Express = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL!,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use("/api", InvoiceRouter);
