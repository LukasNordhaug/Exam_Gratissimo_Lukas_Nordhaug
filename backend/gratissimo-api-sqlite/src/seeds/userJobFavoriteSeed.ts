import { prisma } from "../lib/prisma";

export async function userJobFavoriteSeed() {
  const defaultFavorites = [
    { userId: 1, jobListingId: 2 },
    { userId: 2, jobListingId: 1 },
    { userId: 3, jobListingId: 3 },
    { userId: 1, jobListingId: 5 },
  ];

  for (const favorite of defaultFavorites) {
    prisma.userJobFavorite
      .create({ data: favorite })
      .then(() => {
        console.log(
          `UserJobFavorite for user ${favorite.userId} / listing ${favorite.jobListingId} created successfully.`,
        );
      })
      .catch((error: Error) => {
        console.error(`Error creating user job favorite:`, error);
      });
  }
}
