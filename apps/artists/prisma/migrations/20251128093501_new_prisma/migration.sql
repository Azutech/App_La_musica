-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('LABEL', 'AGGREGATOR', 'PUBLISHER', 'INDIE');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CheckType" AS ENUM ('AML', 'OFAC', 'DUPLICATE', 'IDENTITY', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "CheckStatus" AS ENUM ('PASSED', 'FAILED', 'MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "VerificationMethod" AS ENUM ('MICRO_DEPOSIT', 'API', 'MANUAL');

-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('PASSPORT', 'NATIONAL_ID', 'DRIVER_LICENSE', 'OTHER');

-- AlterTable
ALTER TABLE "ArtistApplication" ADD COLUMN     "country" TEXT,
ADD COLUMN     "documentUrl" TEXT,
ADD COLUMN     "portfolioLink" TEXT,
ADD COLUMN     "socialLink" TEXT;

-- CreateTable
CREATE TABLE "DistributorProfile" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "legalName" TEXT,
    "businessType" TEXT,
    "registrationNumber" TEXT,
    "taxId" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "website" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DistributorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributorUbo" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "nationality" TEXT,
    "idType" "IdType" NOT NULL DEFAULT 'OTHER',
    "idNumber" TEXT,
    "idDocumentUrl" TEXT,
    "ownershipPercentage" DECIMAL(5,2) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isSignatory" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DistributorUbo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributorDocument" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "docUrl" TEXT NOT NULL,
    "docHash" TEXT NOT NULL,
    "status" "DocStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "mimeType" TEXT,
    "size" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DistributorDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCheck" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "checkType" "CheckType" NOT NULL,
    "status" "CheckStatus" NOT NULL,
    "score" INTEGER,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutAccount" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT,
    "bankCode" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationMethod" "VerificationMethod",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayoutAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DistributorProfile_distributorId_key" ON "DistributorProfile"("distributorId");

-- CreateIndex
CREATE INDEX "DistributorUbo_distributorId_idx" ON "DistributorUbo"("distributorId");

-- CreateIndex
CREATE INDEX "DistributorDocument_distributorId_idx" ON "DistributorDocument"("distributorId");

-- CreateIndex
CREATE INDEX "DistributorDocument_docHash_idx" ON "DistributorDocument"("docHash");

-- CreateIndex
CREATE INDEX "VerificationCheck_distributorId_idx" ON "VerificationCheck"("distributorId");

-- CreateIndex
CREATE INDEX "VerificationCheck_checkType_status_idx" ON "VerificationCheck"("checkType", "status");

-- CreateIndex
CREATE INDEX "PayoutAccount_distributorId_idx" ON "PayoutAccount"("distributorId");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutAccount_accountNumber_bankCode_key" ON "PayoutAccount"("accountNumber", "bankCode");

-- AddForeignKey
ALTER TABLE "DistributorProfile" ADD CONSTRAINT "DistributorProfile_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributorUbo" ADD CONSTRAINT "DistributorUbo_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributorDocument" ADD CONSTRAINT "DistributorDocument_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCheck" ADD CONSTRAINT "VerificationCheck_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutAccount" ADD CONSTRAINT "PayoutAccount_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
