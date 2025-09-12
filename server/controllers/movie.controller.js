import { Movie } from "../models/movie.model.js";

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json({
      success: true,
      message: "Movies fetched successfully",
      result: movies,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movie = await Movie.findById(movieId);
    console.log(movie);
    res.json({
      success: true,
      message: "Movies fetched successfully",
      result: movie._doc,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.json({
      success: true,
      message: "Movie created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movieObj = new Movie(req.body);
    await Movie.findByIdAndUpdate(movieId, movieObj);
    res.json({
      success: true,
      message: `Movie ${movieObj.title} updated successfully`,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    await Movie.findByIdAndDelete(movieId);
    res.json({
      success: true,
      message: `Movie deleted successfully`,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
