import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const primsa =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = primsa;
}

export async function connectDB() {
  try {
    await primsa.$connect();
    console.log("Connecting to the database...");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await primsa.$disconnect();
  console.log("DB disconnected.");
}
