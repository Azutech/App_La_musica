-- CreateEnum
CREATE TYPE "ArtistOriginType" AS ENUM ('INDEPENDENT', 'DISTRIBUTOR');

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "distributorId" TEXT,
ADD COLUMN     "originType" "ArtistOriginType" NOT NULL DEFAULT 'INDEPENDENT';

-- CreateTable
CREATE TABLE "Distributor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Distributor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Distributor_email_key" ON "Distributor"("email");

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
