-- CreateEnum
CREATE TYPE "ArtistOriginType" AS ENUM ('independent', 'distributor');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'pending', 'suspended');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "distributorId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "stageName" TEXT NOT NULL,
    "realName" TEXT,
    "bio" TEXT,
    "genre" TEXT,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "profileImage" TEXT,
    "originType" "ArtistOriginType" NOT NULL DEFAULT 'independent',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "stageName" TEXT NOT NULL,
    "genre" TEXT,
    "bio" TEXT,
    "adminNote" TEXT,
    "distributorId" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distributor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "website" TEXT,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Distributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT,
    "email" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_userId_key" ON "Artist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_stageName_key" ON "Artist"("stageName");

-- CreateIndex
CREATE INDEX "Artist_stageName_idx" ON "Artist"("stageName");

-- CreateIndex
CREATE INDEX "Artist_genre_idx" ON "Artist"("genre");

-- CreateIndex
CREATE UNIQUE INDEX "Distributor_email_key" ON "Distributor"("email");

-- CreateIndex
CREATE INDEX "Token_distributorId_idx" ON "Token"("distributorId");

-- CreateIndex
CREATE INDEX "Token_email_idx" ON "Token"("email");

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistApplication" ADD CONSTRAINT "ArtistApplication_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
