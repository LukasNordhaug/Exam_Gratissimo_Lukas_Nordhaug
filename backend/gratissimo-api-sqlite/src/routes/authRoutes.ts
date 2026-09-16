import { Router } from "express";
import { authController } from "../controllers/authController.js";

const router = Router();
router.post("/login", authController.authenticate);
router.post("/refresh", authController.refreshAccessToken);
router.post("/logout", authController.logout);
router.get(
  "/verify",
  authController.authorize,
  authController.getUserFromToken,
);

export const authRoutes = router;
