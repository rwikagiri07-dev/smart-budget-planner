import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Budget name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Travel",
        "Shopping",
        "Entertainment",
        "Health",
        "Education",
        "Bills",
        "Other",
      ],
      default: "Other",
    },

    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    spentAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Safe", "Warning", "Exceeded"],
      default: "Safe",
    },
  },
  {
    timestamps: true,
  },
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
