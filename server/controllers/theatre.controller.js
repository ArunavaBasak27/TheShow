import { Theatre } from "../models/theatre.model.js";

export const getAllTheatres = async (req, res) => {
  try {
    const { page, limit } = req.query;

    let theatres;
    let totalItems;
    let totalPages = 1;
    let currentPage = 1;

    const isPaginated = page !== undefined || limit !== undefined;
    if (isPaginated) {
      currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 5;
      const startIndex = (currentPage - 1) * itemsPerPage;

      totalItems = await Theatre.countDocuments();
      totalPages = Math.ceil(totalItems / itemsPerPage);

      theatres = await Theatre.find().skip(startIndex).limit(itemsPerPage);
    } else {
      theatres = await Theatre.find().populate("owner");
      totalItems = theatres.length;
    }
    res.json({
      success: true,
      message: "Theatres fetched successfully",
      page: page,
      result: theatres,
      total_pages: totalPages,
      total_items: totalItems,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const getTheatreById = async (req, res) => {
  try {
    const theatreId = req.params.theatreId;
    const theatre = await Theatre.findById(theatreId);
    res.json({
      result: theatre,
      success: true,
      message: "Theatre fetched successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const getTheatresByOwner = async (req, res) => {
  try {
    const { page, limit } = req.query;

    let theatres;
    let totalItems;
    let totalPages = 1;
    let currentPage = 1;

    const isPaginated = page !== undefined || limit !== undefined;
    const ownerId = req.user.id;
    theatres = await Theatre.find({ owner: ownerId });
    totalItems = theatres.length;
    if (isPaginated) {
      currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 4;
      const startIndex = (currentPage - 1) * itemsPerPage;

      totalPages = Math.ceil(totalItems / itemsPerPage);
      theatres = await Theatre.find({ owner: ownerId })
        .skip(startIndex)
        .limit(itemsPerPage);
    }

    res.json({
      result: theatres,
      success: true,
      message: `Theatres fetched successfully`,
      page: page,
      total_pages: totalPages,
      total_items: totalItems,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const createTheatre = async (req, res) => {
  try {
    const theatre = new Theatre({ ...req.body, owner: req.user.id });

    await theatre.save();
    res.json({
      success: true,
      message: "Theatre created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const updateTheatre = async (req, res) => {
  try {
    const theatreId = req.params.theatreId;
    const theatreObj = req.body;
    await Theatre.findByIdAndUpdate(theatreId, theatreObj);
    res.json({
      success: true,
      message: "Theatre updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const changeTheatreStatus = async (req, res) => {
  try {
    const theatreId = req.params.theatreId;
    const theatreObj = await Theatre.findById(theatreId);
    theatreObj.isApproved = !theatreObj.isApproved;
    await theatreObj.save();

    res.json({
      success: true,
      message: `Theatre ${theatreObj.isApproved ? "approved" : "blocked"} successfully`,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTheatre = async (req, res) => {
  try {
    const theatreId = req.params.theatreId;
    await Theatre.findByIdAndDelete(theatreId);
    res.json({
      success: true,
      message: "Theatre deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
