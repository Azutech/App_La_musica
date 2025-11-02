/*
  Warnings:

  - Added the required column `first_Name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_Name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ARTIST', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "first_Name" TEXT NOT NULL,
ADD COLUMN     "last_Name" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
