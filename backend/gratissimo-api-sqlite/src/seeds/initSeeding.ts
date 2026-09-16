import { userSeed } from "./userSeed";
import { jobCategorySeed } from "./jobCategorySeed";
import { jobListingSeed } from "./jobListingSeed";
import { userJobFavoriteSeed } from "./userJobFavoriteSeed";
import { articleSeed } from "./articleSeed";
import { newsletterSubscriberSeed } from "./newsletterSubscriberSeed";
import { regionSeed } from "./regionSeed";
import { workTypeSeed } from "./workTypeSeed";
import { testimonySeed } from "./testimonySeed";
import { prisma } from "../lib/prisma";

async function initSeeding() {
  console.log("Running seeds...");
  await userSeed();
  await jobCategorySeed();
  await regionSeed();
  await workTypeSeed();
  await testimonySeed();
  await jobListingSeed();
  await userJobFavoriteSeed();
  await newsletterSubscriberSeed();
  await articleSeed();
  console.log("Seeded all files succesfully");
  return;
}

initSeeding().finally(() => prisma.$disconnect());
