/*
  Warnings:

  - A unique constraint covering the columns `[casoId]` on the table `reunioes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reunioes_casoId_key" ON "reunioes"("casoId");
