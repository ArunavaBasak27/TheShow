import { Theatre } from "../models/theatre.model.js";

export const isValidOwnerMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    const theatreId = req.params.theatreId;
    if (!user) {
      throw new Error("Please log in");
    }

    const theatresOfUser = (await Theatre.find({ owner: user.id })) ?? [];
    const isValid = theatresOfUser.filter(
      (theatre) => theatre.id === theatreId,
    );
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
