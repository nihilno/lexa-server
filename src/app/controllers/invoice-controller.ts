import { type Request, type Response } from "express";
import { prisma } from "../../lib/prisma.js";

export async function getInvoices(req: Request, res: Response) {
  // check if user is the owner

  try {
    const data = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      // where: { userId },
    });
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

export async function getInvoiceById(req: Request, res: Response) {
  // check if user is the owner

  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid invoice ID" });
  }

  try {
    const data = await prisma.invoice.findUnique({
      where: { id },
      // where : {userId}
      include: {
        items: true,
      },
    });

    if (!data) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const invoice = {
      ...data,
      totalPayment: data.totalPayment.toNumber(),
      items: data.items.map((item) => ({
        ...item,
        price: item.price.toNumber(),
      })),
    };

    res.status(200).json(invoice);
  } catch (error) {
    console.error(`Error fetching invoice with id ${id}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function markAsPaid(req: Request, res: Response) {
  // check if user is the owner

  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid invoice ID" });
  }

  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      // where: { id, userId },
      data: { status: "Paid" },
    });

    res.status(200).json({ message: "Invoice marked as paid", invoice });
  } catch (error) {
    console.error(`Error marking invoice with id ${id} as paid:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteInvoice(req: Request, res: Response) {
  // check if user is the owner

  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid invoice ID" });
  }

  const invoice = await prisma.invoice.delete({
    where: { id },
    // userId
  });

  res.status(200).json({ message: "Invoice deleted.", invoice });
  try {
  } catch (error) {
    console.error(`Error marking invoice with id ${id} as paid:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
}
