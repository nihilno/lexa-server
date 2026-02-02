import express, { type Router } from "express";
import {
  getInvoiceById,
  getInvoices,
} from "../controllers/invoice-controller.js";

const router: Router = express.Router();

router.get("/invoices", getInvoices);
router.get("/invoices/:id", getInvoiceById);

export { router };
