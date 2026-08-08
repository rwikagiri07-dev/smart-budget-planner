import Expense from "../models/Expense.js";

/*
|--------------------------------------------------------------------------
| Create Expense
|--------------------------------------------------------------------------
*/

export const createExpense = async (req, res) => {
  try {
    const { title, category, amount, date, notes } = req.body;

    const expense = await Expense.create({
      userId: req.user._id,

      title,

      category,

      amount,

      date,

      notes,
    });

    res.status(201).json({
      success: true,

      message: "Expense added successfully",

      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Expenses
|--------------------------------------------------------------------------
*/

export const getExpenses = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    let filter = {
      userId: req.user._id,
    };

    // Search

    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,

        $options: "i",
      };
    }

    // Category Filter

    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Date Filter

    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),

        $lte: new Date(req.query.endDate),
      };
    }

    const expenses = await Expense.find(filter)

      .sort({
        date: -1,
      })

      .skip(skip)

      .limit(limit);

    const total = await Expense.countDocuments(filter);

    res.status(200).json({
      success: true,

      count: expenses.length,

      total,

      page,

      pages: Math.ceil(total / limit),

      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Expense
|--------------------------------------------------------------------------
*/

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,

      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,

        message: "Expense not found",
      });
    }

    expense.title = req.body.title ?? expense.title;

    expense.category = req.body.category ?? expense.category;

    expense.amount = req.body.amount ?? expense.amount;

    expense.date = req.body.date ?? expense.date;

    expense.notes = req.body.notes ?? expense.notes;

    const updatedExpense = await expense.save();

    res.status(200).json({
      success: true,

      message: "Expense updated successfully",

      expense: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Expense
|--------------------------------------------------------------------------
*/

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,

      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,

        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,

      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
