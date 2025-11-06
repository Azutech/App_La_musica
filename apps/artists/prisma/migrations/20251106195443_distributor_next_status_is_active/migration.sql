/*
  Warnings:

  - The values [ACTIVE,PENDING,SUSPENDED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('active', 'pending', 'suspended');
ALTER TABLE "public"."Distributor" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Distributor" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
ALTER TABLE "Distributor" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Distributor" ALTER COLUMN "status" SET DEFAULT 'pending';
