import { prisma } from "../lib/prisma";

export async function newsletterSubscriberSeed() {
  const defaultSubscribers = [
    { email: "subscriber1@example.com" },
    { email: "subscriber2@example.com" },
    { email: "subscriber3@example.com" },
  ];

  for (const subscriber of defaultSubscribers) {
    prisma.newsletterSubscriber
      .create({ data: subscriber })
      .then(() => {
        console.log(
          `NewsletterSubscriber ${subscriber.email} created successfully.`,
        );
      })
      .catch((error: Error) => {
        console.error(
          `Error creating newsletter subscriber ${subscriber.email}:`,
          error,
        );
      });
  }
}
