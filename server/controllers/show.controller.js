import { Theatre } from "../models/theatre.model.js";
import { Show } from "../models/show.model.js";
import { Movie } from "../models/movie.model.js";

export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId);
    res.json({
      success: true,
      message: "Show fetched successfully",
      result: show,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};

export const getShowsByTheatre = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let totalItems;
    let currentPage = 1;
    let totalPages = 1;
    let shows;

    const isPaginated = page !== undefined || limit !== undefined;
    const theatreId = req.params.theatreId;

    let searchQuery = { theatre: theatreId };
    if (search) {
      const matchedMovies = await Movie.find({
        title: { $regex: search, $options: "i" },
      }).select("_id");

      searchQuery.$or = [{ movie: { $in: matchedMovies.map((m) => m._id) } }];
    }

    if (isPaginated) {
      currentPage = parseInt(page) || 1;
      let itemsPerPage = parseInt(limit) || 4;
      const startIndex = (currentPage - 1) * itemsPerPage;
      totalItems = await Show.find({
        theatre: theatreId,
      }).countDocuments();

      totalPages = Math.ceil(totalItems / itemsPerPage);

      shows = await Show.find(searchQuery)
        .skip(startIndex)
        .limit(itemsPerPage)
        .sort({ date: -1 });
    } else {
      shows = await Show.find(searchQuery).sort({ date: -1 });
      totalItems = await Show.find({
        theatre: theatreId,
      }).countDocuments();
    }

    res.json({
      success: true,
      message: "Shows fetched successfully",
      result: shows,
      total_items: totalItems,
      total_pages: totalPages,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};

export const getShowsByFilter = async (req, res) => {
  try {
    const { movie, theatre, date, page, limit, search } = req.query;
    const filter = {};
    if (movie) {
      filter.movie = movie;
    }
    if (theatre) {
      filter.theatre = theatre;
    }
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        0,
        0,
        0,
        0,
      );
      const endOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        23,
        59,
        59,
        999,
      );
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (search) {
      const matchedMovies = await Movie.find({
        title: { $regex: search, $options: "i" },
      }).select("_id");

      const matchedTheatres = await Theatre.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      filter.$or = [
        { movie: { $in: matchedMovies.map((m) => m._id) } },
        { theatre: { $in: matchedTheatres.map((t) => t._id) } },
      ];
    }

    const totalItems = await Show.countDocuments(filter);
    let showDetails;
    let totalPages = 1;
    const sortOptions = { date: -1 };

    const isPaginated = page !== undefined || limit !== undefined;
    if (isPaginated) {
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 4;
      const startIndex = (currentPage - 1) * itemsPerPage;

      showDetails = await Show.find(filter)
        .sort(sortOptions)
        .populate("theatre")
        .populate("movie")
        .skip(startIndex)
        .limit(itemsPerPage);
      totalPages = Math.ceil(totalItems / itemsPerPage);
    } else {
      showDetails = await Show.find(filter)
        .sort(sortOptions)
        .populate("theatre")
        .populate("movie");
    }

    res.json({
      success: true,
      message: "Shows fetched successfully",
      result: showDetails,
      total_items: totalItems,
      total_pages: totalPages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
export const createShow = async (req, res) => {
  try {
    const theatreId = req.params.theatreId;
    const theatreObj = await Theatre.findOne({
      _id: theatreId,
      isActive: true,
      isApproved: true,
    });
    if (!theatreObj) {
      throw new Error(
        "Theatre  does not exist or is not capable to host shows",
      );
    }

    const showObj = new Show(req.body);
    await showObj.save();
    res.json({
      success: true,
      message: `Show successfully created at ${theatreObj.name}`,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};

export const updateShow = async (req, res) => {
  try {
    const showId = req.params.showId;
    const showObj = req.body;

    const updatedShow = await Show.findByIdAndUpdate(showId, showObj, {
      new: true,
    });

    if (!updatedShow) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Show successfully updated",
      data: updatedShow,
    });
  } catch (error) {
    console.error("Update Show Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const deleteShow = async (req, res) => {
  try {
    const showId = req.params.showId;
    await Show.findByIdAndDelete(showId);
    res.json({
      success: true,
      message: `Show successfully deleted`,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
    });
  }
};
