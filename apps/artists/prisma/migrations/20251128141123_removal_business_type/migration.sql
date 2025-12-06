/*
  Warnings:

  - The `businessType` column on the `DistributorProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DistributorProfile" DROP COLUMN "businessType",
ADD COLUMN     "businessType" TEXT;

-- DropEnum
DROP TYPE "public"."BusinessType";
