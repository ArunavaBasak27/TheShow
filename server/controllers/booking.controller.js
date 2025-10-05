import { Booking } from "../models/booking.model.js";
import { Show } from "../models/show.model.js";
import { Theatre } from "../models/theatre.model.js";
import { stripe } from "../app.js";
import { User } from "../models/user.model.js";

export const initiatePayment = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const show = await Show.findById(showId);

    const user = await User.findById(req.user.id);
    const customer = await stripe.customers.create({
      name: user.name,
      address: {
        line1: user.address,
        city: user.city,
        state: user.state,
        postal_code: user.zip,
        country: "IN",
      },
      email: user.email,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: show.ticketPrice * seats.length * 100,
      currency: "inr",
      description: `Payment for seats ${seats.join(",")}`,
      automatic_payment_methods: {
        enabled: true,
      },
      customer: customer.id, // required for export compliance
      metadata: {
        showId: showId,
        seats: seats.join(","),
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment intent created",
      result: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

    const showId = paymentIntent.metadata.showId;
    const seats = paymentIntent.metadata.seats.split(",");
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
      transactionId: transactionId,
      user: req.user.id,
      seats: seats,
      show: showId,
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
