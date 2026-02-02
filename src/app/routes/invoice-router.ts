import express, { type Router } from "express";
import { getInvoices } from "../controllers/invoice-controller.js";

const router: Router = express.Router();

router.get("/invoices", getInvoices);

export { router };
