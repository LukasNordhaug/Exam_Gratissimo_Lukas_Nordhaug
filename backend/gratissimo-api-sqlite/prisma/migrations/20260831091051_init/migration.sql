/*
  Warnings:

  - You are about to drop the `Organisation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `organisationId` on the `JobListing` table. All the data in the column will be lost.
  - Added the required column `organization` to the `JobListing` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `JobListing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `JobListing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workHome` on table `JobListing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipcode` on table `JobListing` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Organisation";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobListing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "zipcode" INTEGER NOT NULL,
    "organization" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "workHome" TEXT NOT NULL,
    "regionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "jobCategoryId" INTEGER NOT NULL,
    "workTypeId" INTEGER NOT NULL,
    CONSTRAINT "JobListing_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobListing_jobCategoryId_fkey" FOREIGN KEY ("jobCategoryId") REFERENCES "JobCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobListing_workTypeId_fkey" FOREIGN KEY ("workTypeId") REFERENCES "WorkType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobListing" ("address", "city", "createdAt", "description", "id", "jobCategoryId", "regionId", "title", "userId", "workHome", "workTypeId", "zipcode") SELECT "address", "city", "createdAt", "description", "id", "jobCategoryId", "regionId", "title", "userId", "workHome", "workTypeId", "zipcode" FROM "JobListing";
DROP TABLE "JobListing";
ALTER TABLE "new_JobListing" RENAME TO "JobListing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
