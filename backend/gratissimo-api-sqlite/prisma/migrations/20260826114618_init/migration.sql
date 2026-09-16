/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `WorkType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkType_type_key" ON "WorkType"("type");
