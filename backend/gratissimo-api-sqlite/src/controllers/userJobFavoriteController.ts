import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { parseId } from "../utils/parseId";
import { AppError } from "../utils/AppError";

export class UserJobFavoriteController {
  getAllUserJobFavorites = async (req: Request, res: Response) => {
    const user = req.user ?? null;
    console.log(user);
    if (!user) {
      throw new AppError(404, "No user found");
    }
    const items = await prisma.userJobFavorite.findMany({
      where: { user },
      include: {
        jobListing: {
          include: { region: true, workType: true, jobCategory: true },
        },
      },
    });
    if (!items) {
      throw new AppError(404, "No user favorites found");
    }
    res.status(200).json(items);
  };

  getUserJobFavoriteById = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    const user = req.user ?? null;
    if (!user) {
      throw new AppError(404, "No user favorites");
    }
    if (!id) throw new AppError(400, "Invalid user job favorite ID");

    const item = await prisma.userJobFavorite.findUnique({
      where: { id, user },
      include: {
        jobListing: {
          include: { region: true, workType: true, jobCategory: true },
        },
      },
    });
    if (!item) throw new AppError(404, "User job favorite not found");
    res.status(200).json(item);
  };

  createUserJobFavorite = async (req: Request, res: Response) => {
    const user = req.user;
    const data = { ...req.body };
    if (!user) {
      throw new AppError(
        500,
        "User not found - make sure you sent the bearer token",
      );
    }
    const userId = user.id;
    const jobListingId = Number(data.jobListingId ?? data.jobId ?? data.id);
    if (!Number.isInteger(jobListingId) || jobListingId <= 0) {
      throw new AppError(400, "A valid jobListingId is required");
    }
    const jobListing = await prisma.jobListing.findUnique({
      where: { id: jobListingId },
    });
    if (!jobListing) {
      throw new AppError(404, "Job listing not found");
    }
    const item = await prisma.userJobFavorite.create({
      data: { userId, jobListingId },
    });
    res.status(201).json(item);
  };

  updateUserJobFavorite = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);

    const data = { ...req.body };
    const userId = parseInt(data?.userId);
    const jobListingId = parseInt(data.jobListingId);

    if (!id) throw new AppError(400, "Invalid user job favorite ID");

    const existingItem = await prisma.userJobFavorite.findUnique({
      where: { id },
    });
    if (!existingItem) throw new AppError(404, "User job favorite not found");

    const item = await prisma.userJobFavorite.update({
      where: { id },
      data: { userId, jobListingId },
    });
    res.status(200).json(item);
  };

  deleteUserJobFavorite = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw new AppError(400, "Invalid user job favorite ID");

    const existingItem = await prisma.userJobFavorite.findUnique({
      where: { id },
    });
    if (!existingItem) throw new AppError(404, "User job favorite not found");

    await prisma.userJobFavorite.delete({ where: { id } });
    res.status(200).send("User favorite deleted");
  };
}

export const userJobFavoriteController = new UserJobFavoriteController();
