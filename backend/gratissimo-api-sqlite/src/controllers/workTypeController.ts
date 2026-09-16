import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { parseId } from "../utils/parseId";
import { AppError } from "../utils/AppError";

export class WorkTypeController {
  getAllworkTypes = async (req: Request, res: Response) => {
    const items = await prisma.workType.findMany();
    res.status(200).json(items);
  };

  getworkTypeById = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw new AppError(400, "Invalid workType ID");

    const item = await prisma.workType.findUnique({ where: { id } });
    if (!item) throw new AppError(404, "workType not found");
    res.status(200).json(item);
  };

  createworkType = async (req: Request, res: Response) => {
    const data = { ...req.body };
    const item = await prisma.workType.create({ data });
    res.status(201).json(item);
  };
}

export const workTypeController = new WorkTypeController();
