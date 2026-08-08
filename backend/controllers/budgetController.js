import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";

/*
|--------------------------------------------------------------------------
| Create Budget
|--------------------------------------------------------------------------
*/

export const createBudget = async (req, res) => {
  try {
    const { name, category, amount, startDate, endDate } = req.body;

    const budget = await Budget.create({
      userId: req.user._id,

      name,

      category,

      amount,

      startDate,

      endDate,
    });

    res.status(201).json({
      success: true,

      message: "Budget created successfully",

      budget,
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
| Get All Budgets (with spentAmount attached)
|--------------------------------------------------------------------------
*/

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (budgets.length === 0) {
      return res.status(200).json({
        success: true,

        count: 0,

        budgets: [],
      });
    }

    // Pull every expense once, then sum matching ones per budget in memory.
    // A budget "matches" an expense when the category is the same and the
    // expense date falls inside the budget's start/end window.
    const expenses = await Expense.find({
      userId: req.user._id,
    }).select("category amount date");

    const budgetsWithSpent = budgets.map((budget) => {
      const start = new Date(budget.startDate);
      const end = new Date(budget.endDate);

      const spentAmount = expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);

          return (
            expense.category === budget.category &&
            expenseDate >= start &&
            expenseDate <= end
          );
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        ...budget.toObject(),
        spentAmount,
      };
    });

    res.status(200).json({
      success: true,

      count: budgetsWithSpent.length,

      budgets: budgetsWithSpent,
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
| Update Budget
|--------------------------------------------------------------------------
*/

export const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({
      _id: req.params.id,

      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,

        message: "Budget not found",
      });
    }

    budget.name = req.body.name ?? budget.name;

    budget.category = req.body.category ?? budget.category;

    budget.amount = req.body.amount ?? budget.amount;

    budget.startDate = req.body.startDate ?? budget.startDate;

    budget.endDate = req.body.endDate ?? budget.endDate;

    const updatedBudget = await budget.save();

    res.status(200).json({
      success: true,

      message: "Budget updated successfully",

      budget: updatedBudget,
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
| Delete Budget
|--------------------------------------------------------------------------
*/

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,

      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,

        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,

      message: "Budget deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};