import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

const SALT_ROUNDS = 10;

export async function userSeed() {
  const defaultUsers = [
    {
      firstname: "John",
      lastname: "Due",
      password: "password",
      email: "info@webudvikler.dk",
      phone: 12345678,
      address: "Nørregade 10",
      city: "Aalborg",
      zipcode: 9000,
    },
    {
      firstname: "Bob",
      lastname: "Jensen",
      password: "password",
      email: "bob@webudvikler.dk",
      phone: 87654321,
      address: "Vesterbrogade 42",
      city: "Aarhus",
      zipcode: 8000,
    },
    {
      firstname: "Clara",
      lastname: "Nielsen",
      password: "password",
      email: "clara@webudvikler.dk",
      phone: 11223344,
      address: "Åboulevarden 5",
      city: "Odense",
      zipcode: 5000,
    },
  ];

  for (const user of defaultUsers) {
    const hashed = await bcrypt.hash(user.password, SALT_ROUNDS);
    prisma.user
      .create({ data: { ...user, password: hashed } })
      .then(() => {
        console.log(
          `User ${user.firstname} ${user.lastname} created successfully.`,
        );
      })
      .catch((error: Error) => {
        console.error(`Error creating user ${user.firstname}:`, error);
      });
  }
}
