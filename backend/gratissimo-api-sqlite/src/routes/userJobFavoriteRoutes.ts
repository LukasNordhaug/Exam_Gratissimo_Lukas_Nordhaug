import { Router } from "express";
import { userJobFavoriteController } from "../controllers/userJobFavoriteController.js";
import { authController } from "../controllers/authController.js";

const router = Router();

router.get(
  "/favorites",
  authController.authorize,
  userJobFavoriteController.getAllUserJobFavorites,
);
router.get(
  "/favorites/:id",
  authController.authorize,
  userJobFavoriteController.getUserJobFavoriteById,
);
router.post(
  "/favorites",
  authController.authorize,
  userJobFavoriteController.createUserJobFavorite,
);
router.put(
  "/favorites/:id",
  authController.authorize,
  userJobFavoriteController.updateUserJobFavorite,
);
router.delete(
  "/favorites/:id",
  authController.authorize,
  userJobFavoriteController.deleteUserJobFavorite,
);

export const userJobFavoriteRoutes = router;
