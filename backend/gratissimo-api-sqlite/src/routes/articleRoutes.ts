import { Router } from "express";
import { articleController } from "../controllers/articleController.js";
import { authController } from "../controllers/authController.js";
const router = Router();

router.get("/articles", articleController.getAllArticles);
router.get("/articles/:id", articleController.getArticleById);
router.post(
  "/articles",
  authController.authorize,
  articleController.createArticle,
);

export const articleRoutes = router;
