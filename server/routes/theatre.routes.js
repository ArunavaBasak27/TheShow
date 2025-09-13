import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  changeTheatreStatus,
  createTheatre,
  deleteTheatre,
  getAllTheatres,
  getTheatreById,
  getTheatresByOwner,
  updateTheatre,
} from "../controllers/theatre.controller.js";
import { isValidOwnerMiddleware } from "../middlewares/isValidOwner.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllTheatres);
router.get("/user", authMiddleware, getTheatresByOwner);
router.get("/:theatreId", authMiddleware, getTheatreById);

router.post("/", authMiddleware, createTheatre);

router.put(
  "/:theatreId",
  authMiddleware,
  isValidOwnerMiddleware,
  updateTheatre,
);

router.patch(
  "/:theatreId",
  authMiddleware,
  roleMiddleware(["admin"]),
  changeTheatreStatus,
);

router.delete(
  "/:theatreId",
  authMiddleware,
  isValidOwnerMiddleware,
  deleteTheatre,
);

export const theatreRoutes = router;
