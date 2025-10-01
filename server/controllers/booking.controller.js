import { Booking } from "../models/booking.model.js";
import { Show } from "../models/show.modal.js";

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
