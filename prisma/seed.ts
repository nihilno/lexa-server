import { Prisma } from "../src/generated/prisma/client.js";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  // 1️⃣ Clear previous data
  await prisma.item.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ Cleared previous data");

  // 2️⃣ Create user
  const user = await prisma.user.create({
    data: {
      name: "ACME Corp",
      email: "user@example.com",
      password: "hashedpassword123",
    },
  });

  console.log(`✅ Created user: ${user.name}`);

  // 3️⃣ Create default sender address for user
  const defaultAddress = await prisma.address.create({
    data: {
      name: "ACME Corp",
      email: "user@example.com",
      street: "Main Street 1",
      city: "Warsaw",
      postalCode: "00-001",
      country: "Poland",
      userId: user.id,
    },
  });

  // 4️⃣ Connect default address to user
  await prisma.user.update({
    where: { id: user.id },
    data: { defaultAddressId: defaultAddress.id },
  });

  console.log(`✅ Created default sender address for user`);

  // 5️⃣ Seed 10 invoices
  const invoices = [];

  for (let i = 1; i <= 10; i++) {
    const itemCount = Math.floor(Math.random() * 3) + 2; // 2-4 items

    // Generate items
    const items = Array.from({ length: itemCount }).map(() => {
      const quantity = Math.floor(Math.random() * 5) + 1;
      const price = new Prisma.Decimal((Math.random() * 100 + 10).toFixed(2));
      return {
        name: `Item ${Math.random().toString(36).substring(2, 6)}`,
        quantity,
        price,
      };
    });

    // Compute totalPayment
    const totalPayment = items.reduce(
      (sum, item) => sum.add(item.price.mul(item.quantity)),
      new Prisma.Decimal(0),
    );

    // Random recipient
    const recipientNumber = Math.floor(Math.random() * 1000);

    // Create invoice with snapshot sender + recipient + items
    const invoice = await prisma.invoice.create({
      data: {
        projectDescription: `Invoice #${i}`,

        // Snapshot sender from defaultAddress
        fromName: defaultAddress.name,
        fromEmail: defaultAddress.email,
        fromStreet: defaultAddress.street,
        fromCity: defaultAddress.city,
        fromPostCode: defaultAddress.postalCode,
        fromCountry: defaultAddress.country,

        // Snapshot recipient
        toName: `Client ${recipientNumber}`,
        toEmail: `client${recipientNumber}@example.com`,
        toStreet: `${recipientNumber} Client Street`,
        toCity: "Krakow",
        toPostCode: "30-001",
        toCountry: "Poland",

        paymentTerms: "Net 14",
        issueDate: new Date(),
        createdAt: new Date(),
        paymentDue: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // +14 days
        totalPayment,
        status: "Pending",

        userId: user.id,

        items: { create: items },
      },
    });

    invoices.push(invoice);
  }

  console.log(`✅ Seeded ${invoices.length} invoices with items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
