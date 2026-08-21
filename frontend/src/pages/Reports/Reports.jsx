import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

import { Pie, Bar } from "react-chartjs-2";

import { FaWallet, FaMoneyBillWave, FaPiggyBank } from "react-icons/fa";

import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
);

const CATEGORY_COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

function Reports() {
  const [report, setReport] = useState({
    totalBudget: 0,
    totalExpenses: 0,
    remainingBudget: 0,
    categoryExpenses: [],
    monthlyExpenses: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/reports");

      setReport({
        totalBudget: data.totalBudget || 0,
        totalExpenses: data.totalExpenses || 0,
        remainingBudget: data.remainingBudget || 0,
        categoryExpenses: data.categoryExpenses || [],
        monthlyExpenses: data.monthlyExpenses || [],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  // ============ CATEGORY DONUT ============

  const categoryLabels = report.categoryExpenses.map((item) => item.category);
  const categoryValues = report.categoryExpenses.map((item) =>
    Number(item.amount || 0),
  );
  const categoryTotal = categoryValues.reduce((sum, v) => sum + v, 0);

  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryLabels.map(
          (_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        ),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: { display: false },
      datalabels: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percent = categoryTotal
              ? ((value / categoryTotal) * 100).toFixed(1)
              : 0;
            return `${context.label}: ₹${value.toLocaleString()} (${percent}%)`;
          },
        },
      },
    },
  };

  // ============ MONTHLY BAR ============

  const monthlyLabels = report.monthlyExpenses.map((item) => item.month);
  const monthlyValues = report.monthlyExpenses.map((item) =>
    Number(item.amount || 0),
  );

  const monthlyChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyValues,
        backgroundColor: "#2563eb",
        borderRadius: 6,
        maxBarThickness: 60,
      },
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString()}`,
        },
      },
      datalabels: {
        color: "#ffffff",
        font: {
          weight: "bold",
          size: 13,
        },
        anchor: "center",
        align: "center",
        formatter: (value) => `₹${value.toLocaleString()}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#334155",
          callback: (value) => `₹${value.toLocaleString()}`,
        },
        grid: { color: "#f1f5f9" },
      },
      x: {
        ticks: { color: "#334155" },
        grid: { display: false },
      },
    },
  };

  // ============ BUDGET OVERVIEW BAR ============

  const budgetChartData = {
    labels: ["Budget", "Expenses", "Remaining"],
    datasets: [
      {
        data: [
          report.totalBudget,
          report.totalExpenses,
          Math.max(report.remainingBudget, 0),
        ],
        backgroundColor: ["#2563eb", "#dc2626", "#16a34a"],
        borderRadius: 6,
        maxBarThickness: 60,
      },
    ],
  };

  const budgetChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString()}`,
        },
      },
      datalabels: {
        color: "#ffffff",
        font: {
          weight: "bold",
          size: 13,
        },
        anchor: "center",
        align: "center",
        formatter: (value) => `₹${value.toLocaleString()}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#334155",
          callback: (value) => `₹${value.toLocaleString()}`,
        },
        grid: { color: "#f1f5f9" },
      },
      x: {
        ticks: { color: "#334155" },
        grid: { display: false },
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Analyze your financial activity.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading reports...</div>
      ) : (
        <>
          {/* SUMMARY */}
          <div className="report-summary">
            <div className="report-stat">
              <div className="report-stat-icon budget">
                <FaWallet />
              </div>
              <div>
                <span>Total Budget</span>
                <strong>₹{Number(report.totalBudget).toLocaleString()}</strong>
              </div>
            </div>

            <div className="report-stat">
              <div className="report-stat-icon expense">
                <FaMoneyBillWave />
              </div>
              <div>
                <span>Total Expenses</span>
                <strong>
                  ₹{Number(report.totalExpenses).toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="report-stat">
              <div className="report-stat-icon remaining">
                <FaPiggyBank />
              </div>
              <div>
                <span>Remaining</span>
                <strong>
                  ₹{Number(report.remainingBudget).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          {/* CHARTS */}
          <div className="reports-grid">
            {/* CATEGORY */}
            <div className="report-card">
              <div className="report-card-header">
                <h2>Expenses by Category</h2>
              </div>

              {categoryValues.length > 0 ? (
                <div className="category-report-body">
                  <div className="chart-container category-donut">
                    <Pie
                      data={categoryChartData}
                      options={categoryChartOptions}
                    />
                  </div>

                  <div className="category-legend-list">
                    {categoryLabels.map((label, i) => {
                      const value = categoryValues[i];
                      const percent = categoryTotal
                        ? ((value / categoryTotal) * 100).toFixed(1)
                        : 0;

                      return (
                        <div className="category-legend-row" key={label}>
                          <span
                            className="legend-dot"
                            style={{
                              background:
                                CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                            }}
                          />
                          <span className="category-legend-label">{label}</span>
                          <span className="category-legend-amount">
                            ₹{value.toLocaleString()}
                          </span>
                          <span className="category-legend-percent">
                            {percent}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="chart-empty p-10">No category data available.</div>
              )}
            </div>

            {/* BUDGET */}
            <div className="report-card">
              <div className="report-card-header">
                <h2>Budget Overview</h2>
              </div>

              <div className="chart-container">
                <Bar data={budgetChartData} options={budgetChartOptions} />
              </div>
            </div>

            {/* MONTHLY */}
            <div className="report-card report-card-wide">
              <div className="report-card-header">
                <h2>Monthly Spending</h2>
              </div>

              <div className="chart-container">
                {monthlyValues.length > 0 ? (
                  <Bar data={monthlyChartData} options={monthlyChartOptions} />
                ) : (
                  <div className="chart-empty">No monthly data available.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default Reports;

