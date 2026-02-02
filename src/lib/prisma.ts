import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { PrismaClient } from "../generated/prisma/client.js";
config();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"],
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Connected to the database...");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await prisma.$disconnect();
  console.log("DB disconnected.");
}
