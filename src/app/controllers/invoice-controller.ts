import { type Request, type Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { FormSchema } from "../../lib/schema.js";

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

export async function createInvoice(req: Request, res: Response) {
  // check if user is logged in

  const userId = "63633767-eca5-4a8b-992c-7be48fc967cd"; // placeholder
  const validated = FormSchema.safeParse(req.body);

  if (!validated.success) {
    return res.status(400).json({
      message: "Invalid invoice data",
      errors: validated.error.issues,
    });
  }

  const { items, issueDate } = validated.data;

  try {
    for (const item of validated.data.items) {
      if (item.quantity < 1 || item.quantity > 999) {
        return res
          .status(400)
          .json({ message: "Item quantity must be between 1 and 999" });
      }

      if (item.price < 1 || item.price > 99999) {
        return res
          .status(400)
          .json({ message: "Item price must be between 1 and 99999" });
      }
    }

    const totalPayment = items.reduce(
      (acc, item) => acc.add(new Prisma.Decimal(item.quantity).mul(item.price)),
      new Prisma.Decimal(0),
    );

    const paymentDue = new Date(
      issueDate.getTime() +
        Number(validated.data.paymentTerms.split(" ")[1]) * 24 * 60 * 60 * 1000,
    );

    const invoiceData = {
      ...validated.data,
      totalPayment,
      userId,
      fromName: "Maciej Kowalski",
      fromEmail: "maciej.kowalski@example.com",
      createdAt: issueDate,
      paymentDue,
      status: "Pending" as const,
      items: {
        create: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: new Prisma.Decimal(item.price),
        })),
      },
    };

    const invoice = await prisma.invoice.create({
      data: invoiceData,
      include: { items: true },
    });

    return res.status(201).json({ message: "Invoice created", invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
