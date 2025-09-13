import express from "express";
import dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes.js";
import { connectDB } from "./database/connectDB.js";
import cookieParser from "cookie-parser";
import { movieRoutes } from "./routes/movie.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "../.env" });

const app = express();

// Front end service
app.use(
  express.static(path.join(__dirname, "../client/dist"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/movies", movieRoutes);
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  await connectDB();
  console.log(`Server started at http://localhost:${port}}`);
});
