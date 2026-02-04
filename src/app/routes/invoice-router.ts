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

router.get("/", getInvoices);
router.post("/", createInvoice);
router.get("/:id", getInvoiceById);
router.patch("/:id", editInvoice);
router.patch("/:id/pay", markAsPaid);
router.delete("/:id", deleteInvoice);

export { router };
