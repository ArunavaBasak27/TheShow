import { Theatre } from "../models/theatre.model.js";
import { Show } from "../models/show.model.js";

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
    const theatreId = req.params.theatreId;
    const shows = await Show.find({ theatre: theatreId });
    res.json({
      success: true,
      message: "Shows fetched successfully",
      result: shows,
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
    const { movie, theatre, date } = req.query;
    const filter = {};
    if (movie) {
      filter.movie = movie;
    }
    if (theatre) {
      filter.theatre = theatre;
    }
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }
    const showDetails = await Show.find(filter)
      .populate("theatre")
      .populate("movie");
    res.json({
      success: true,
      message: "Shows fetched successfully",
      result: showDetails,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error,
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
