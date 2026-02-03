/*
  Warnings:

  - You are about to drop the column `fromPostalCode` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `toPostalCode` on the `invoices` table. All the data in the column will be lost.
  - Added the required column `fromPostCode` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toPostCode` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "fromPostalCode",
DROP COLUMN "toPostalCode",
ADD COLUMN     "fromPostCode" TEXT NOT NULL,
ADD COLUMN     "toPostCode" TEXT NOT NULL;
