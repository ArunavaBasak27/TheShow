import { model, Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    show: {
      type: Schema.Types.ObjectId,
      ref: "shows",
      required: true,
    },
    seats: {
      type: Array,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Booking = model("bookings", bookingSchema);
