import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { parseId } from "../utils/parseId";
import { AppError } from "../utils/AppError";

export class JobCategoryController {
  getAllJobCategories = async (req: Request, res: Response) => {
    const items = await prisma.jobCategory.findMany();
    res.status(200).json(items);
  };

  getJobCategoryById = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw new AppError(400, "Invalid job category ID");

    const item = await prisma.jobCategory.findUnique({
      where: { id },
      include: {
        jobListings: {
          include: { region: true, workType: true, jobCategory: true },
        },
      },
    });
    if (!item) throw new AppError(404, "Job category not found");
    res.status(200).json(item);
  };

  createJobCategory = async (req: Request, res: Response) => {
    const data = { ...req.body };
    const item = await prisma.jobCategory.create({ data });
    res.status(201).json(item);
  };
}

export const jobCategoryController = new JobCategoryController();
