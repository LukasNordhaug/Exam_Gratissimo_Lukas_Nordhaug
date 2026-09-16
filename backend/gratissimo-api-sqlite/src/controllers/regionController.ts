import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { parseId } from "../utils/parseId";
import { AppError } from "../utils/AppError";

export class RegionController {
  getAllRegions = async (req: Request, res: Response) => {
    const items = await prisma.region.findMany();
    res.status(200).json(items);
  };

  getRegionById = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw new AppError(400, "Invalid region ID");

    const item = await prisma.region.findUnique({ where: { id } });
    if (!item) throw new AppError(404, "Region not found");
    res.status(200).json(item);
  };

  createRegion = async (req: Request, res: Response) => {
    const data = { ...req.body };
    const item = await prisma.region.create({ data });
    res.status(201).json(item);
  };
}

export const regionController = new RegionController();
