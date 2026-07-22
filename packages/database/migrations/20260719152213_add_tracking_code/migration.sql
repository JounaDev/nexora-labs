/*
  Warnings:

  - A unique constraint covering the columns `[trackingCode]` on the table `RepairTicket` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RepairTicket" ADD COLUMN     "trackingCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RepairTicket_trackingCode_key" ON "RepairTicket"("trackingCode");
