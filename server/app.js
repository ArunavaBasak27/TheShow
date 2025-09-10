import express from "express";
import dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes.js";
import { connectDB } from "./database/connectDB.js";
import cookieParser from "cookie-parser";

dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  await connectDB();
  console.log(`Server started at http://localhost:${port}}`);
});
