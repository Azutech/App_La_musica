/*
  Warnings:

  - You are about to drop the column `website` on the `Distributor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Distributor" DROP COLUMN "website",
ADD COLUMN     "avatar" TEXT;
