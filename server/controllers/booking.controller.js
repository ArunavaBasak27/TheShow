import { Booking } from "../models/booking.model.js";
import { Show } from "../models/show.model.js";
import { Theatre } from "../models/theatre.model.js";
import { stripe } from "../app.js";
import { User } from "../models/user.model.js";
import emailHelper from "../email/emailHelper.js";
import moment from "moment";
import { Movie } from "../models/movie.model.js";

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

    const bookingInfo = await Booking.findById(booking._id)
      .populate("user")
      .populate({
        path: "show",
        populate: { path: ["theatre", "movie"] },
      });

    if (bookingInfo.user.isVerified) {
      // Send email confirmation for verified users

      await emailHelper({
        receiverEmail: bookingInfo.user.email,
        templateName: "ticketTemplate.html",
        credentials: {
          name: bookingInfo.user.name,
          movie: bookingInfo.show.movie.title,
          theatre: bookingInfo.show.theatre.name,
          date: moment(bookingInfo.show.date).format("dd/MM/yyyy"),
          time: moment(bookingInfo.show.date).format("hh:mm A"),
          seats: bookingInfo.seats.join(","),
          amount: bookingInfo.seats.length * bookingInfo.show.ticketPrice,
          transactionId: bookingInfo.transactionId,
        },
      });
    }

    res.json({
      success: true,
      message: "Booking created. Please check your email for tickets",
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
    const { page, limit, search } = req.query;

    const isPaginated = page !== undefined || limit !== undefined;
    let currentPage = 1;
    let totalPages = 1;

    let searchQuery = { user: user.id };
    if (search) {
      const matchedMovies = await Movie.find({
        title: { $regex: search, $options: "i" },
      }).select("_id");
      const matchedTheatres = await Theatre.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");
      const matchedShowIds = await Show.find({
        $or: [
          { movie: { $in: matchedMovies.map((m) => m._id) } },
          { theatre: { $in: matchedTheatres.map((t) => t._id) } },
        ],
      }).select("_id");

      searchQuery.show = {
        $in: matchedShowIds.map((s) => s._id),
      };
    }

    let bookings = await Booking.find(searchQuery)
      .sort({ createdAt: -1 })
      .populate("user")
      .populate({
        path: "show",
        populate: { path: ["theatre", "movie"] },
      });

    let totalItems = bookings.length;

    if (isPaginated) {
      currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 5;
      const startIndex = (currentPage - 1) * itemsPerPage;
      totalPages = Math.ceil(totalItems / itemsPerPage);
      bookings = await Booking.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(itemsPerPage)
        .populate("user")
        .populate({
          path: "show",
          populate: { path: ["theatre", "movie"] },
        });
    }
    res.json({
      success: true,
      message: "Bookings fetched successfully",
      result: bookings,
      page: currentPage,
      total_pages: totalPages,
      total_items: totalItems,
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
    const { page, limit, search } = req.query;

    const theatres = await Theatre.find({ owner: user.id });
    const theatreIds = theatres.map((theatre) => theatre._id);

    const shows = await Show.find({ theatre: { $in: theatreIds } });
    const showIds = shows.map((show) => show._id);

    let searchQuery = { show: { $in: showIds } };
    if (search) {
      const matchedMovies = await Movie.find({
        title: { $regex: search, $options: "i" },
      }).select("_id");

      const matchedTheatres = await Theatre.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const matchedUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      searchQuery.$or = [
        { movie: { $in: matchedMovies.map((m) => m._id) } },
        { theatre: { $in: matchedTheatres.map((t) => t._id) } },
        { user: { $in: matchedUsers.map((u) => u._id) } },
      ];
    }

    let bookings = await Booking.find(searchQuery)
      .sort({ createdAt: -1 })
      .populate("user")
      .populate({
        path: "show",
        populate: { path: ["theatre", "movie"] },
      });
    let totalItems = bookings.length;

    const isPaginated = page !== undefined || limit !== undefined;
    let currentPage = 1;
    let totalPages = 1;
    if (isPaginated) {
      currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 5;
      const startIndex = (currentPage - 1) * itemsPerPage;
      totalPages = Math.ceil(totalItems / itemsPerPage);
      bookings = await Booking.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(itemsPerPage)
        .populate("user")
        .populate({
          path: "show",
          populate: { path: ["theatre", "movie"] },
        });
    }

    res.json({
      success: true,
      message: "Bookings fetched successfully",
      result: bookings,
      page: currentPage,
      total_pages: totalPages,
      total_items: totalItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
