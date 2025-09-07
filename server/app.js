import express from 'express';
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";
import {userRoutes} from "./routes/user.routes.js";
import {connectDB} from "./database/connectDB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path:"../.env"})

const app = express()
app.use(express.json())

app.use("/api/users", userRoutes);

const port = process.env.PORT || 5000

app.listen(port,async ()=>{
    await connectDB();
    console.log(`Server started at http://localhost:${port}}`)
})