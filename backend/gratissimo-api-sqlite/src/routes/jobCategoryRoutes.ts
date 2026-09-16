import { Router } from "express";
import { jobCategoryController } from "../controllers/jobCategoryController.js";
import { authController } from "../controllers/authController.js";

const router = Router();

router.get("/job-categories", jobCategoryController.getAllJobCategories);
router.get("/job-categories/:id", jobCategoryController.getJobCategoryById);
router.post(
  "/job-categories",
  authController.authorize,
  jobCategoryController.createJobCategory,
);

export const jobCategoryRoutes = router;
