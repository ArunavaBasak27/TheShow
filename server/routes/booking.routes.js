import express from "express";
import { createBooking } from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBooking);

export const bookingRoutes = router;
