import { prisma } from "../lib/prisma";

export async function workTypeSeed() {
  const defaultWorkTypes = [
    { type: "Deltid" },
    { type: "Fuldtid" },
    { type: "Flex" },
  ];

  for (const workType of defaultWorkTypes) {
    await prisma.workType.upsert({
      where: { type: workType.type },
      update: {},
      create: { type: workType.type },
    });
  }
}
