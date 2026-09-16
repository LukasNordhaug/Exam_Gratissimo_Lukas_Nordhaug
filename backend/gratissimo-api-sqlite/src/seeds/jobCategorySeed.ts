import { prisma } from "../lib/prisma";

export async function jobCategorySeed() {
  const defaultJobCategories = [
    { name: "Undervisning" },
    { name: "Teknologi" },
    { name: "Kultur" },
    { name: "Håndværk" },
    { name: "Industri" },
    { name: "Service" },
    { name: "Kommunikation" },
    { name: "Kontor" },
    { name: "Øvrige" },
  ];

  for (const category of defaultJobCategories) {
    prisma.jobCategory
      .create({ data: category })
      .then(() => {
        console.log(`JobCategory ${category.name} created successfully.`);
      })
      .catch((error: Error) => {
        console.error(`Error creating job category ${category.name}:`, error);
      });
  }
}
