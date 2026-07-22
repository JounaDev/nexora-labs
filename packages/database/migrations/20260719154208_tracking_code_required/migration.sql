/*
  Warnings:

  - Made the column `trackingCode` on table `RepairTicket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RepairTicket" ALTER COLUMN "trackingCode" SET NOT NULL;
