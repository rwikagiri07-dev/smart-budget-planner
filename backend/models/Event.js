import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    title: {
      type: String,

      required: [true, "Event title is required"],

      trim: true,
    },

    date: {
      type: Date,

      required: true,
    },

    budget: {
      type: Number,

      required: true,

      min: 0,

      default: 0,
    },

    spentAmount: {
      type: Number,

      default: 0,
    },

    description: {
      type: String,

      default: "",

      trim: true,
    },

    status: {
      type: String,

      enum: ["Upcoming", "Completed", "Cancelled"],

      default: "Upcoming",
    },
  },

  {
    timestamps: true,
  },
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
