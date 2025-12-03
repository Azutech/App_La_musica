/*
  Warnings:

  - A unique constraint covering the columns `[distributorId]` on the table `DistributorUbo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DistributorUbo_distributorId_key" ON "DistributorUbo"("distributorId");
