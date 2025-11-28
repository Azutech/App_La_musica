/*
  Warnings:

  - The `businessType` column on the `DistributorProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('LABEL', 'AGGREGATOR', 'PUBLISHER', 'INDIE', 'MANAGEMENT', 'DISTRIBUTION_COMPANY', 'SERVICE_PROVIDER', 'OTHER');

-- AlterTable
ALTER TABLE "DistributorProfile" DROP COLUMN "businessType",
ADD COLUMN     "businessType" "BusinessType";
