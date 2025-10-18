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
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 5000;

// Trust proxy for Render (gets real client IP)
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: true, // Include rate limit headers
  legacyHeaders: false,
});

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

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      // Scripts: self + Stripe JS + any external CDNs (e.g., if using React from CDN; adjust as needed)
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Temp for React inline; remove later with nonces
        "https://js.stripe.com",
        // Add others like "https://connect.facebook.net" if using social logins
      ],
      // Styles: self + unsafe-inline for React/CSS-in-JS
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Temp for inline styles; use nonces/hashes in prod
        // "https://fonts.googleapis.com" if using Google Fonts
      ],
      // Images: self + data URLs + Stripe icons
      imgSrc: [
        "'self'",
        "data:",
        "https://*.stripe.com", // Stripe elements/icons
        "https://assets-in.bmscdn.com",
        // "https://example.com" for your custom images
      ],
      // Connections: self + Stripe API + any fetch/AJAX to your backend
      connectSrc: [
        "'self'",
        "https://api.stripe.com", // Stripe API calls
        "https://*.stripe.com", // Webhooks/elements
        // "wss://your-websocket-url" if using real-time
      ],
      // Fonts: self + Google Fonts (common in React apps)
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        // "data:" if base64 fonts
      ],
      // Block plugins/embeds
      objectSrc: ["'none'"],
      // Upgrade HTTP to HTTPS (enforced by Render anyway)
      upgradeInsecureRequests: [],
      // Report violations (optional: set reportUri to your endpoint for monitoring)
      // reportUri: '/csp-violation-report-endpoint',
    },
  }),
);
//rate limit API
app.use("/api/", limiter);

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
