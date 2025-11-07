/*
  Warnings:

  - The values [PENDING,APPROVED,REJECTED] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [INDEPENDENT,DISTRIBUTOR] on the enum `ArtistOriginType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStatus_new" AS ENUM ('pending', 'approved', 'rejected');
ALTER TABLE "public"."ArtistApplication" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ArtistApplication" ALTER COLUMN "status" TYPE "ApplicationStatus_new" USING ("status"::text::"ApplicationStatus_new");
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "public"."ApplicationStatus_old";
ALTER TABLE "ArtistApplication" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ArtistOriginType_new" AS ENUM ('independent', 'distributor');
ALTER TABLE "public"."Artist" ALTER COLUMN "originType" DROP DEFAULT;
ALTER TABLE "Artist" ALTER COLUMN "originType" TYPE "ArtistOriginType_new" USING ("originType"::text::"ArtistOriginType_new");
ALTER TYPE "ArtistOriginType" RENAME TO "ArtistOriginType_old";
ALTER TYPE "ArtistOriginType_new" RENAME TO "ArtistOriginType";
DROP TYPE "public"."ArtistOriginType_old";
ALTER TABLE "Artist" ALTER COLUMN "originType" SET DEFAULT 'independent';
COMMIT;

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "originType" SET DEFAULT 'independent';

-- AlterTable
ALTER TABLE "ArtistApplication" ALTER COLUMN "status" SET DEFAULT 'pending';
