/*
  Warnings:

  - You are about to alter the column `sentiment` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "public"."Review" ALTER COLUMN "sentiment" SET DATA TYPE DOUBLE PRECISION;
