import { Prisma } from "../src/generated/prisma/client.js";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  await prisma.invoice.deleteMany();
  console.log("🗑️  Deleted all invoices");

  const user = await prisma.user.findFirst();

  if (!user) {
    throw new Error("No user found. Create a user before seeding invoices.");
  }

  const invoices = [];

  for (let i = 1; i <= 10; i++) {
    const itemCount = Math.floor(Math.random() * 3) + 2;

    const items = Array.from({ length: itemCount }).map(() => {
      const quantity = Math.floor(Math.random() * 5) + 1;
      const price = new Prisma.Decimal((Math.random() * 100 + 10).toFixed(2));

      return {
        name: `Item ${Math.random().toString(36).substring(2, 6)}`,
        quantity,
        price,
      };
    });

    const totalPayment = items.reduce((sum, item) => {
      return sum.add(item.price.mul(item.quantity));
    }, new Prisma.Decimal(0));

    const invoice = await prisma.invoice.create({
      data: {
        number: i,
        description: `Invoice #${i}`,

        senderName: "ACME Corp",
        senderAddress: "Main Street 1",
        senderCity: "Warsaw",
        senderPostalCode: "00-001",
        senderCountry: "Poland",

        recipientName: `Client ${i}`,
        recipientAddress: `${i} Client Street`,
        recipientCity: "Krakow",
        recipientPostalCode: "30-001",
        recipientCountry: "Poland",

        paymentDue: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // +14 days
        totalPayment,
        status: "PENDING",

        userId: user.id,

        items: {
          create: items,
        },
      },
    });

    invoices.push(invoice);
  }

  console.log(`✅ Seeded ${invoices.length} invoices`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
