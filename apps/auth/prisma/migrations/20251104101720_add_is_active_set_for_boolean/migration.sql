-- DropIndex
DROP INDEX "public"."Token_userId_code_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
