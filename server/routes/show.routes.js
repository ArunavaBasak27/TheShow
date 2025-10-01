import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isValidOwnerMiddleware } from "../middlewares/isValidOwner.middleware.js";
import {
  createShow,
  deleteShow,
  getShowById,
  getShowsByFilter,
  getShowsByTheatre,
  updateShow,
} from "../controllers/show.controller.js";

const router = express.Router();

router.get("/:showId", getShowById);
router.get("/", getShowsByFilter);
router.get(
  "/:theatreId",
  authMiddleware,
  isValidOwnerMiddleware,
  getShowsByTheatre,
);

router.post("/:theatreId", authMiddleware, isValidOwnerMiddleware, createShow);
router.put(
  "/:showId/theatre/:theatreId",
  authMiddleware,
  isValidOwnerMiddleware,
  updateShow,
);
router.delete(
  "/:showId/theatre/:theatreId",
  authMiddleware,
  isValidOwnerMiddleware,
  deleteShow,
);
export const showRoutes = router;
