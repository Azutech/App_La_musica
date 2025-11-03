-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'pending', 'suspended');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';
