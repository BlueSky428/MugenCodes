-- AlterTable
ALTER TABLE "projects" ADD COLUMN "negotiationMessage" TEXT;
ALTER TABLE "projects" ADD COLUMN "negotiationPending" TEXT;
ALTER TABLE "projects" ADD COLUMN "negotiationRequestedAt" DATETIME;
