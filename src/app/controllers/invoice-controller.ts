import { type Request, type Response } from "express";
import { prisma } from "../../lib/prisma.js";

export async function getInvoices(req: Request, res: Response) {
  try {
    const data = await prisma.invoice.findMany();
    const invoices = data.map((invoice) => ({
      ...invoice,
      totalPayment: invoice.totalPayment.toNumber(),
    }));

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
