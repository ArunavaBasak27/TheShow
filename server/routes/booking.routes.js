import express from "express";
import {
  createBooking,
  getBookingsForPartner,
  getBookingsForUser,
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/partner", authMiddleware, getBookingsForPartner);
router.get("/user", authMiddleware, getBookingsForUser);
export const bookingRoutes = router;
