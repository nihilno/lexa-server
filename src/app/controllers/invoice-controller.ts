import { type Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { FormSchema } from "../../lib/schema.js";
import { validateItems } from "../utils/validateData.js";

export async function getInvoices(req: RequestWithUser, res: Response) {
  const userId = req?.user!.id;

  try {
    const data = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        userId,
      },
    });
    const invoices = data.map((invoice) => ({
      ...invoice,
      totalPayment: invoice.totalPayment.toNumber(),
    }));

    return res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getInvoiceById(req: RequestWithUser, res: Response) {
  const userId = req?.user!.id;

  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid invoice ID" });
  }

  try {
    const data = await prisma.invoice.findUnique({
      where: { id, userId },
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

    return res.status(200).json(invoice);
  } catch (error) {
    console.error(`Error fetching invoice with id ${id}:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function markAsPaid(req: RequestWithUser, res: Response) {
  const userId = req?.user!.id;

  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid invoice ID" });
  }

  try {
    const invoice = await prisma.invoice.update({
      where: { id, userId },
      data: { status: "Paid" },
      include: { items: true },
    });

    return res.status(200).json({ message: "Invoice marked as paid", invoice });
  } catch (error) {
    console.error(`Error marking invoice with id ${id} as paid:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteInvoice(req: RequestWithUser, res: Response) {
  const userId = req?.user!.id;

  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid invoice ID" });
  }

  try {
    const invoice = await prisma.invoice.delete({
      where: { id, userId },
    });

    return res.status(200).json({ message: "Invoice deleted.", invoice });
  } catch (error) {
    console.error(`Error marking invoice with id ${id} as paid:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createInvoice(req: RequestWithUser, res: Response) {
  const userId = req?.user!.id;
  const fromName = req.user?.name ? req.user.name : "--";
  const fromEmail = req.user?.email ? req.user.email : "--";

  const validated = FormSchema.safeParse(req.body);

  if (!validated.success) {
    return res.status(400).json({
      message: "Invalid invoice data",
      errors: validated.error.issues,
    });
  }

  const { items, ...rest } = validated.data;

  try {
    const isValidItems = validateItems(items);
    if (!isValidItems) {
      return res.status(400).json({ message: "Invalid item data" });
    }

    const issueDate = new Date(validated.data.issueDate);

    const totalPayment = items.reduce(
      (acc, item) => acc.add(new Prisma.Decimal(item.quantity).mul(item.price)),
      new Prisma.Decimal(0),
    );

    const paymentDue = new Date(
      issueDate.getTime() +
        Number(validated.data.paymentTerms.split(" ")[1]) * 24 * 60 * 60 * 1000,
    );

    const invoiceData = {
      ...rest,
      totalPayment,
      userId,
      fromName,
      fromEmail,
      issueDate,
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
    });

    return res.status(201).json({ message: "Invoice created", invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function editInvoice(req: RequestWithUser, res: Response) {
  const userId = req?.user!.id;
  const fromName = req.user?.name ? req.user.name : "--";
  const fromEmail = req.user?.email ? req.user.email : "--";

  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid invoice ID" });
  }

  const validated = FormSchema.safeParse(req.body);

  if (!validated.success) {
    return res.status(400).json({
      message: "Invalid invoice data",
      errors: validated.error.issues,
    });
  }

  const { items, ...rest } = validated.data;

  try {
    const isValidItems = validateItems(items);
    if (!isValidItems) {
      return res.status(400).json({ message: "Invalid item data" });
    }

    const issueDate = new Date(validated.data.issueDate);

    const totalPayment = items.reduce(
      (acc, item) => acc.add(new Prisma.Decimal(item.quantity).mul(item.price)),
      new Prisma.Decimal(0),
    );

    const paymentDue = new Date(
      issueDate.getTime() +
        Number(validated.data.paymentTerms.split(" ")[1]) * 24 * 60 * 60 * 1000,
    );

    const existingInvoice = await prisma.invoice.findUnique({
      where: { id, userId },
      include: { items: true },
    });

    if (!existingInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const existingItemIds = existingInvoice.items.map((item) => item.id);
    const updateItems: {
      where: { id: string };
      data: { name: string; quantity: number; price: Prisma.Decimal };
    }[] = items
      .filter(
        (
          i,
        ): i is { id: string; name: string; quantity: number; price: number } =>
          !!i.id,
      )
      .map((item) => ({
        where: { id: item.id },
        data: {
          name: item.name,
          quantity: item.quantity,
          price: new Prisma.Decimal(item.price),
        },
      }));

    const formItemIds = items.filter((i) => i.id).map((i) => i.id);
    const deleteItemIds = existingItemIds.filter(
      (id) => !formItemIds.includes(id),
    );

    const createItems = items
      .filter((i) => !("id" in i) || !i.id)
      .map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: new Prisma.Decimal(item.price),
      }));

    const itemsNested: any = {};
    if (updateItems.length > 0) {
      itemsNested.update = updateItems;
    }

    if (deleteItemIds.length > 0) {
      itemsNested.deleteMany = { id: { in: deleteItemIds } };
    }

    if (createItems.length > 0) {
      itemsNested.create = createItems;
    }

    const invoiceData = {
      ...rest,
      totalPayment,
      userId,
      fromName,
      fromEmail,
      issueDate,
      paymentDue,
      status: "Pending" as const,
      items: itemsNested,
    };

    const invoice = await prisma.invoice.update({
      where: { id, userId },
      data: invoiceData,
      include: { items: true },
    });

    return res.status(200).json({ message: "Invoice updated", invoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
