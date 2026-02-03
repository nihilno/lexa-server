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
router.get("/invoices/:id", getInvoiceById);
router.patch("/invoices/:id", markAsPaid);
router.delete("/invoices/:id", deleteInvoice);
router.post("/invoices", createInvoice);
router.put("/invoices/:id", editInvoice);

export { router };
