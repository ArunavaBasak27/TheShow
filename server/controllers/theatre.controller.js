import { Theatre } from "../models/theatre.model.js";

export const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().populate("owner");
    res.json({
      result: theatres,
      success: true,
      message: "Theatres fetched successfully",
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
    const ownerId = req.user.id;
    const theatres = await Theatre.find({ owner: ownerId });
    res.json({
      result: theatres,
      success: true,
      message: `Theatres fetched successfully`,
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
