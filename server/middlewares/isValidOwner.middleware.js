import { Theatre } from "../models/theatre.model.js";

export const isValidOwnerMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    const theatreId = req.params.theatreId;
    if (!user) {
      throw new Error("Please log in");
    }

    const theatre = await Theatre.findById(theatreId);
    const isValid = theatre.owner == user.id; //theatre.owner might be Object not string
    if (!isValid) {
      throw new Error("You are not owner of this theatre");
    }
    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
