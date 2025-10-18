import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import Stripe from "stripe";

import { connectDB } from "./database/connectDB.js";
import { userRoutes } from "./routes/user.routes.js";
import { movieRoutes } from "./routes/movie.routes.js";
import { theatreRoutes } from "./routes/theatre.routes.js";
import { showRoutes } from "./routes/show.routes.js";
import { bookingRoutes } from "./routes/booking.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 5000;

// Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Static file serving for frontend
app.use(
  express.static(path.join(__dirname, "../client/dist"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  }),
);

// Body and cookie parsers
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/user", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);

// Fallback route for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// Start server
app.listen(port, async () => {
  await connectDB();
  console.log(`Server started at http://localhost:${port}`);
});
