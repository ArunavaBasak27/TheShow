import { Movie } from "../models/movie.model.js";

export const getAllMovies = async (req, res) => {
  try {
    const { page, limit } = req.query;

    let movies;
    let totalItems;
    let totalPages = 1;
    let currentPage = 1;

    const isPaginated = page !== undefined || limit !== undefined;

    if (isPaginated) {
      currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 4;
      const startIndex = (currentPage - 1) * itemsPerPage;

      totalItems = await Movie.countDocuments();
      totalPages = Math.ceil(totalItems / itemsPerPage);

      movies = await Movie.find({}).skip(startIndex).limit(itemsPerPage);
    } else {
      movies = await Movie.find({});
      totalItems = movies.length;
    }

    res.json({
      success: true,
      message: "Movies fetched successfully",
      page: isPaginated ? currentPage : null,
      result: movies,
      total_pages: isPaginated ? totalPages : 1,
      total_items: totalItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movie = await Movie.findById(movieId);
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
