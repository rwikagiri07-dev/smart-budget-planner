import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
    },

    category: {
      type: String,
      required: true,

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
      required: [true, "Expense amount is required"],

      min: 0,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },

  {
    timestamps: true,
  },
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
