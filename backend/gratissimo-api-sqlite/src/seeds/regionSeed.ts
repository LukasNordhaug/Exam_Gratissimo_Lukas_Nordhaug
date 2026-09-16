import { prisma } from "../lib/prisma";

export async function regionSeed() {
  const defaultRegions = [
    { name: "Nordjylland" },
    { name: "Midtjylland" },
    { name: "Sønderjylland" },
    { name: "Fyn" },
    { name: "Sjælland" },
    { name: "Bornholm" },
  ];

  for (const region of defaultRegions) {
    await prisma.region.upsert({
      where: { name: region.name },
      update: {},
      create: { name: region.name },
    });
  }
}
