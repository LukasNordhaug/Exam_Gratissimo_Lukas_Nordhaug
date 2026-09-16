import { Router } from "express";
import { workTypeController } from "../controllers/workTypeController.js";
import { authController } from "../controllers/authController.js";

const router = Router();

router.get("/workTypes", workTypeController.getAllworkTypes);
router.get("/workTypes/:id", workTypeController.getworkTypeById);
router.post(
  "/workTypes",
  authController.authorize,
  workTypeController.createworkType,
);

export const workTypeRoutes = router;
