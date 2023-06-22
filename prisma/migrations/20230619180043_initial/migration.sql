-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('SENT', 'RECEIVED');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" TEXT;
