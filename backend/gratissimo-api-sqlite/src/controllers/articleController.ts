import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { parseId } from "../utils/parseId";
import { AppError } from "../utils/AppError";

export class ArticleController {
  getAllArticles = async (req: Request, res: Response) => {
    const items = await prisma.article.findMany();
    res.status(200).json(items);
  };

  getArticleById = async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw new AppError(400, "Invalid article ID");

    const item = await prisma.article.findUnique({ where: { id } });
    if (!item) throw new AppError(404, "Article not found");
    res.status(200).json(item);
  };

  createArticle = async (req: Request, res: Response) => {
    const data = { ...req.body };
    if (!data.title || !data.content)
      throw new AppError(
        400,
        "Missing required fields - 'title' or 'content' missing",
      );

    const item = await prisma.article.create({ data });
    res.status(201).json(item);
  };
}

export const articleController = new ArticleController();
