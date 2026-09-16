/*
  Warnings:

  - Added the required column `workTypeModelId` to the `JobListing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "workTypeModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobListing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT,
    "zipcode" INTEGER,
    "city" TEXT,
    "workHome" TEXT,
    "workType" TEXT,
    "regionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "jobCategoryId" INTEGER NOT NULL,
    "organisationId" INTEGER NOT NULL,
    "workTypeModelId" INTEGER NOT NULL,
    CONSTRAINT "JobListing_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobListing_jobCategoryId_fkey" FOREIGN KEY ("jobCategoryId") REFERENCES "JobCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobListing_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobListing_workTypeModelId_fkey" FOREIGN KEY ("workTypeModelId") REFERENCES "workTypeModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobListing" ("address", "city", "createdAt", "description", "id", "jobCategoryId", "organisationId", "regionId", "title", "userId", "workHome", "workType", "zipcode") SELECT "address", "city", "createdAt", "description", "id", "jobCategoryId", "organisationId", "regionId", "title", "userId", "workHome", "workType", "zipcode" FROM "JobListing";
DROP TABLE "JobListing";
ALTER TABLE "new_JobListing" RENAME TO "JobListing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
