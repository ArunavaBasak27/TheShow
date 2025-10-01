import { model, Schema } from "mongoose";

const showSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId,
    ref: "movies",
  },
  theatre: {
    type: Schema.Types.ObjectId,
    ref: "theatres",
  },
  date: {
    type: Date,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  bookedSeats: {
    type: [String],
    default: [],
  },
  isCanceled: {
    type: Boolean,
    default: false,
  },
});

export const Show = model("show", showSchema);
