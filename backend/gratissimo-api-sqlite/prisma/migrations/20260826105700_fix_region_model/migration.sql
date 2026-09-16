/*
  Warnings:

  - You are about to drop the column `jobListingId` on the `Region` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Region" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Region" ("id", "name") SELECT "id", "name" FROM "Region";
DROP TABLE "Region";
ALTER TABLE "new_Region" RENAME TO "Region";
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
