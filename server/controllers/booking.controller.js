import { Booking } from "../models/booking.model.js";
import { Show } from "../models/show.model.js";
import { Theatre } from "../models/theatre.model.js";

export const createBooking = async (req, res) => {
  try {
    const { show: showId, seats } = req.body;

    // Try to reserve seats atomically
    const updatedShow = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: seats } },
      { $push: { bookedSeats: { $each: seats } } },
      { new: true },
    );

    if (!updatedShow) {
      return res.status(400).json({
        success: false,
        message: "Some seats are already booked",
      });
    }

    // Create booking
    const booking = new Booking({
      ...req.body,
      user: req.user.id,
    });
    await booking.save();

    res.json({
      success: true,
      message: "Booking created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingsForUser = async (req, res) => {
  try {
    const user = req.user;

    const bookings = await Booking.find({ user: user.id })
      .populate("user")
      .populate({
        path: "show",
        populate: { path: ["theatre", "movie"] },
      });
    res.json({
      success: true,
      message: "Bookings fetched successfully",
      result: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingsForPartner = async (req, res) => {
  try {
    const user = req.user;

    const theatres = await Theatre.find({ owner: user.id });
    const theatreIds = theatres.map((theatre) => theatre._id);

    const shows = await Show.find({ theatre: { $in: theatreIds } });
    const showIds = shows.map((show) => show._id);

    const bookings = await Booking.find({ show: { $in: showIds } })
      .populate("user")
      .populate({
        path: "show",
        populate: { path: ["theatre", "movie"] },
      });
    res.json({
      success: true,
      message: "Bookings fetched successfully",
      result: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
