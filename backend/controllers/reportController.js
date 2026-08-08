import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import Event from "../models/Event.js";

/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
*/

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalBudget = await Budget.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalExpenses = await Expense.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const upcomingEvents = await Event.countDocuments({
      userId: userId,
      status: "Upcoming",
      date: {
        $gte: new Date(),
      },
    });

    const budgetAmount = totalBudget[0]?.total || 0;

    const expenseAmount = totalExpenses[0]?.total || 0;

    res.status(200).json({
      success: true,

      stats: {
        totalBudget: budgetAmount,
        totalExpenses: expenseAmount,
        remainingBudget:
          budgetAmount - expenseAmount,
        upcomingEvents,
      },
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
| Expense Report
|--------------------------------------------------------------------------
*/

export const getExpenseReport = async (req, res) => {
  try {
    const userId = req.user._id;

    /*
    |--------------------------------------------------------------------------
    | Total Budget
    |--------------------------------------------------------------------------
    */

    const totalBudget = await Budget.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);


    /*
    |--------------------------------------------------------------------------
    | Total Expenses
    |--------------------------------------------------------------------------
    */

    const totalExpenses = await Expense.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);


    /*
    |--------------------------------------------------------------------------
    | Expenses By Category
    |--------------------------------------------------------------------------
    */

    const categoryReport = await Expense.aggregate([
      {
        $match: {
          userId: userId,
        },
      },

      {
        $group: {
          _id: "$category",

          total: {
            $sum: "$amount",
          },
        },
      },

      {
        $sort: {
          total: -1,
        },
      },
    ]);


    /*
    |--------------------------------------------------------------------------
    | Monthly Expenses
    |--------------------------------------------------------------------------
    */

    const monthlyReport = await Expense.aggregate([
      {
        $match: {
          userId: userId,
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$date",
            },

            year: {
              $year: "$date",
            },
          },

          total: {
            $sum: "$amount",
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);


    const budgetAmount =
      totalBudget[0]?.total || 0;

    const expenseAmount =
      totalExpenses[0]?.total || 0;


    /*
    |--------------------------------------------------------------------------
    | Format Category Report
    |--------------------------------------------------------------------------
    */

    const categoryExpenses =
      categoryReport.map((item) => ({
        category: item._id,
        amount: item.total,
      }));


    /*
    |--------------------------------------------------------------------------
    | Format Monthly Report
    |--------------------------------------------------------------------------
    */

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];


    const monthlyExpenses =
      monthlyReport.map((item) => ({
        month:
          `${monthNames[item._id.month - 1]} ${item._id.year}`,

        amount: item.total,
      }));


    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    res.status(200).json({
      success: true,

      totalBudget: budgetAmount,

      totalExpenses: expenseAmount,

      remainingBudget:
        budgetAmount - expenseAmount,

      categoryExpenses,

      monthlyExpenses,

      // Keep original reports too
      categoryReport,

      monthlyReport,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};