/*
  Warnings:

  - Made the column `session_id` on table `Events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Events" ALTER COLUMN "session_id" SET NOT NULL;
