import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { Prisma } from "../../generated/prisma/client";
import bcrypt from "bcrypt";

export class UserController {
  getUserByAuth = async (req: Request, res: Response) => {
    const user = req.user;
    const userId = user?.id;

    if (!userId) {
      throw new AppError(
        400,
        "You need to be signed in and supply your auth token",
      );
    }
    const items = await prisma.user.findMany({
      where: { id: user.id },
    });
    res.status(200).json(items);
  };

  createUser = async (req: Request, res: Response) => {
    const data = { ...req.body };
    const phone = data.phone === undefined ? undefined : parseInt(data.phone);
    const zipcode =
      data.zipcode === undefined ? undefined : parseInt(data.zipcode);
    const passwordHashed = await bcrypt.hash(data.password, 10);
    const item = await prisma.user.create({
      data: {
        ...data,
        phone: phone,
        zipcode: zipcode,
        password: passwordHashed,
      },
    });
    res.status(201).json(item);
  };

  updateUser = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError(400, "You need to be signed in to update user");
    }
    const id = user?.id;

    const existingItem = await prisma.user.findUnique({ where: { id } });
    if (!existingItem) throw new AppError(404, "User not found");

    const data = { ...req.body };
    const phone = parseInt(data.phone);
    const zipcode = parseInt(data.zipcode);

    const item = await prisma.user.update({
      where: { id },
      data: {
        firstname: data.firstname ?? Prisma.skip,
        lastname: data.lastname ?? Prisma.skip,
        email: data.email ?? Prisma.skip,
        password: data.password
          ? await bcrypt.hash(data.password, 10)
          : Prisma.skip,
        phone: phone ?? Prisma.skip,
        address: data.address ?? Prisma.skip,
        city: data.city ?? Prisma.skip,
        zipcode: zipcode ?? Prisma.skip,
      },
    });
    res.status(200).json(item);
  };

  deleteUser = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError(400, "You need to be signed in to delete user");
    }
    const id = user?.id;
    if (!id) throw new AppError(400, "Invalid user ID");

    const existingItem = await prisma.user.findUnique({ where: { id } });
    if (!existingItem) throw new AppError(404, "User not found");

    await prisma.user.delete({ where: { id } });
    res.status(200).send("User deleted");
  };
}

export const userController = new UserController();
