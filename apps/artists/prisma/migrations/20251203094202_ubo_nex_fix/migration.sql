/*
  Warnings:

  - The `idType` column on the `DistributorUbo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DistributorUbo" DROP COLUMN "idType",
ADD COLUMN     "idType" TEXT;

-- DropEnum
DROP TYPE "public"."IdType";
