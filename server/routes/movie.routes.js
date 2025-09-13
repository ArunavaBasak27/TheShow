import express from "express";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
} from "../controllers/movie.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:movieId", getMovieById);

router.post("/", authMiddleware, roleMiddleware(["admin"]), createMovie);

router.put("/:movieId", authMiddleware, roleMiddleware(["admin"]), updateMovie);

router.delete(
  "/:movieId",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteMovie,
);

export const movieRoutes = router;
