import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { parseId } from "../utils/parseId";
import { AppError } from "../utils/AppError";
//ændrer job for at kontakt info :)
export class JobListingController {
  getAllJobListings = async (req: Request, res: Response) => {
    const items = await prisma.jobListing.findMany({
      include: {
        region: true,
        workType: true,
        jobCategory: true,
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            zipcode: true,
          },
        },
      },
    });
    res.status(200).json(items);
  };

  getJobListingById = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw new AppError(400, "Invalid job listing ID");

    const item = await prisma.jobListing.findUnique({
      where: { id },
      include: {
        region: true,
        workType: true,
        jobCategory: true,
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            zipcode: true,
          },
        },
      },
    });
    if (!item) throw new AppError(404, "Job listing not found");
    res.status(200).json(item);
  };

  createJobListing = async (req: Request, res: Response) => {
    const data = { ...req.body };
    const workHome = data.workHome;

    console.log("WorkHome is", workHome);

    const zipCode = parseInt(data.zipcode);
    const regionId = parseInt(data.regionId);
    const userId = parseInt(data.userId);
    const jobCategoryId = parseInt(data.jobCategoryId);
    const workTypeId = parseInt(data.workTypeId);

    if (
      workHome !== "On-site" &&
      workHome !== "Remote" &&
      workHome !== "Hybrid"
    ) {
      throw new AppError(
        405,
        'workHome must be one of: "On-site", "Remote" or "Hybrid',
      );
    }
    const item = await prisma.jobListing.create({
      data: {
        ...data,
        zipcode: zipCode,
        regionId: regionId,
        userId: userId,
        jobCategoryId: jobCategoryId,
        workTypeId: workTypeId,
      },
    });
    res.status(201).json(item);
  };

  updateJobListing = async (req: Request, res: Response) => {
    const data = { ...req.body };
    const workHome = data.workHome;

    console.log("WorkHome is", workHome);

    const zipCode = parseInt(data.zipcode);
    const regionId = parseInt(data.regionId);
    const userId = parseInt(data.userId);
    const jobCategoryId = parseInt(data.jobCategoryId);
    const workTypeId = parseInt(data.workTypeId);

    const id = parseId(req.params.id);
    if (!id) throw new AppError(400, "Invalid job listing ID");

    const existingItem = await prisma.jobListing.findUnique({ where: { id } });
    if (!existingItem) throw new AppError(404, "Job listing not found");

    const item = await prisma.jobListing.update({
      where: { id },
      data: {
        ...data,
        zipcode: zipCode,
        regionId: regionId,
        userId: userId,
        jobCategoryId: jobCategoryId,
        workTypeId: workTypeId,
      },
    });
    res.status(200).json(item);
  };

  deleteJobListing = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw new AppError(400, "Invalid job listing ID");

    const existingItem = await prisma.jobListing.findUnique({ where: { id } });
    if (!existingItem) throw new AppError(404, "Job listing not found");

    // Delete related favorites before the listing to satisfy foreign key constraint
    await prisma.userJobFavorite.deleteMany({ where: { jobListingId: id } });
    await prisma.jobListing.delete({ where: { id } });
    res.status(200).send("Job listing deleted");
  };
}

export const jobListingController = new JobListingController();
