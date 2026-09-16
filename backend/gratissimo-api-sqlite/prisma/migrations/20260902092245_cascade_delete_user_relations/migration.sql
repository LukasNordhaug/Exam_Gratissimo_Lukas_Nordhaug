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
    CONSTRAINT "JobListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "JobListing_jobCategoryId_fkey" FOREIGN KEY ("jobCategoryId") REFERENCES "JobCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobListing_workTypeId_fkey" FOREIGN KEY ("workTypeId") REFERENCES "WorkType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobListing" ("address", "city", "createdAt", "description", "id", "jobCategoryId", "organization", "regionId", "title", "userId", "workHome", "workTypeId", "zipcode") SELECT "address", "city", "createdAt", "description", "id", "jobCategoryId", "organization", "regionId", "title", "userId", "workHome", "workTypeId", "zipcode" FROM "JobListing";
DROP TABLE "JobListing";
ALTER TABLE "new_JobListing" RENAME TO "JobListing";
CREATE TABLE "new_UserJobFavorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "jobListingId" INTEGER NOT NULL,
    CONSTRAINT "UserJobFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserJobFavorite_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "JobListing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserJobFavorite" ("id", "jobListingId", "userId") SELECT "id", "jobListingId", "userId" FROM "UserJobFavorite";
DROP TABLE "UserJobFavorite";
ALTER TABLE "new_UserJobFavorite" RENAME TO "UserJobFavorite";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
