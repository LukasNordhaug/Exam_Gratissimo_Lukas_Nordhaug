-- CreateTable
CREATE TABLE "Testimony" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Testimony_name_key" ON "Testimony"("name");
