/*
  Warnings:

  - You are about to drop the column `userId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ArtistApplication` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReleaseType" AS ENUM ('album', 'ep', 'single');

-- CreateEnum
CREATE TYPE "ReleaseStatus" AS ENUM ('DRAFT', 'PENDING', 'RELEASED');

-- DropIndex
DROP INDEX "public"."Artist_userId_key";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "ArtistApplication" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseType" "ReleaseType" NOT NULL,
    "upc" TEXT,
    "coverArtUrl" TEXT,
    "releaseDate" TIMESTAMP(3),
    "status" "ReleaseStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "releaseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isrc" TEXT,
    "position" INTEGER,
    "previewStart" INTEGER,
    "previewEnd" INTEGER,
    "durationSeconds" INTEGER,
    "explicit" BOOLEAN NOT NULL DEFAULT false,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Release_upc_key" ON "Release"("upc");

-- CreateIndex
CREATE UNIQUE INDEX "Track_isrc_key" ON "Track"("isrc");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;
