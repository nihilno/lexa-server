import express, { type Router } from "express";
import {
  createInvoice,
  deleteInvoice,
  editInvoice,
  getInvoiceById,
  getInvoices,
  markAsPaid,
} from "../controllers/invoice-controller.js";

const router: Router = express.Router();

router.get("/invoices", getInvoices);
router.post("/invoices", createInvoice);
router.get("/invoices/:id", getInvoiceById);
router.patch("/invoices/:id", editInvoice);
router.patch("/invoices/:id/pay", markAsPaid);
router.delete("/invoices/:id", deleteInvoice);

export { router };
