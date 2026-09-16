import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

export class TestimonyController {
  getAllTestimonies = async (req: Request, res: Response) => {
    const items = await prisma.testimony.findMany();
    res.status(200).json(items);
  };
}

export const testimonyController = new TestimonyController();
