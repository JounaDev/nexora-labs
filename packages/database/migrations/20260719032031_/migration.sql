-- AlterTable
ALTER TABLE "RepairTicket" ADD COLUMN     "discount" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "laborCost" DECIMAL(10,2),
ADD COLUMN     "partsCost" DECIMAL(10,2),
ADD COLUMN     "tax" DECIMAL(10,2) DEFAULT 0;
