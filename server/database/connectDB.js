import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    if (connection) {
      console.log(`Connected to DB ${connection.host}`);
    }
  } catch (error) {
    console.log("Error connecting DB", error.message);
  }
};
