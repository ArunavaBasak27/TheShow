import express from "express";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
} from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:movieId", getMovieById);
router.post("/", createMovie);
router.put("/:movieId", updateMovie);
router.delete("/:movieId", deleteMovie);

export const movieRoutes = router;
