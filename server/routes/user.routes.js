import express from "express";
import {
  currentUser,
  forgotPassword,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", authMiddleware, currentUser);
router.get("/users", authMiddleware, getAllUsers);
router.patch("/:userId", authMiddleware, verifyUser);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

export const userRoutes = router;
