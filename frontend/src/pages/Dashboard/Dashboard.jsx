import { useEffect, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "react-chartjs-2";

import {
  FaWallet,
  FaMoneyBillWave,
  FaPiggyBank,
  FaCalendarAlt,
} from "react-icons/fa";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import api from "../../services/api";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBudget: 0,
    totalExpenses: 0,
    remainingBudget: 0,
    upcomingEvents: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/reports/dashboard");

      setStats(data.stats);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const usedPercent =
    stats.totalBudget > 0
      ? Math.round((stats.totalExpenses / stats.totalBudget) * 100)
      : 0;

  const remainingPercent = Math.max(100 - usedPercent, 0);

  const usageStatus =
    usedPercent >= 100 ? "over" : usedPercent >= 80 ? "warning" : "safe";

  const usageColors = {
    safe: "#16a34a",
    warning: "#d97706",
    over: "#dc2626",
  };

  const remainingAmount = Math.max(stats.remainingBudget, 0);

  const budgetPieData = {
    labels: ["Used", "Remaining"],
    datasets: [
      {
        data: [stats.totalExpenses, remainingAmount],
        backgroundColor: [usageColors[usageStatus], "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  
  
const budgetPieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => {
          const percent =
            context.dataIndex === 0 ? usedPercent : remainingPercent;

          return `${context.label}: ${percent}%`;
        },
      },
    },
    datalabels: {
      display: false,
    },
  },
};

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>Here's an overview of your finances.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon budget-icon">
                <FaWallet />
              </div>

              <div>
                <p>Total Budget</p>

                <h2>₹{stats.totalBudget.toLocaleString()}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon expense-icon">
                <FaMoneyBillWave />
              </div>

              <div>
                <p>Total Expenses</p>

                <h2>₹{stats.totalExpenses.toLocaleString()}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon remaining-icon">
                <FaPiggyBank />
              </div>

              <div>
                <p>Remaining Budget</p>

                <h2>₹{stats.remainingBudget.toLocaleString()}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon event-icon">
                <FaCalendarAlt />
              </div>

              <div>
                <p>Upcoming Events</p>

                <h2>{stats.upcomingEvents}</h2>
              </div>
            </div>
          </div>

          <div className="dashboard-extra-grid">
            {/* Budget Usage - Pie Chart */}

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2>Budget Usage</h2>
              </div>

              <div className="budget-usage">
                <div className="budget-pie-wrapper">
                  <div className="budget-pie-chart">
                    <Pie data={budgetPieData} options={budgetPieOptions} />

                    <div className="budget-pie-center">
                      <strong>{usedPercent}%</strong>
                      <span>used</span>
                    </div>
                  </div>

                  <div className="budget-pie-legend">
                    <div className="budget-pie-legend-item">
                      <span
                        className="legend-dot"
                        style={{ background: usageColors[usageStatus] }}
                      />

                      <div>
                        <p>Used</p>

                        <strong>₹{stats.totalExpenses.toLocaleString()}</strong>

                        <span>{usedPercent}%</span>
                      </div>
                    </div>

                    <div className="budget-pie-legend-item">
                      <span
                        className="legend-dot"
                        style={{ background: "#e5e7eb" }}
                      />

                      <div>
                        <p>Remaining</p>

                        <strong>₹{remainingAmount.toLocaleString()}</strong>

                        <span>{remainingPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {usageStatus === "over" && (
                  <p className="budget-usage-alert">
                    You've exceeded your total budget.
                  </p>
                )}

                {usageStatus === "warning" && (
                  <p className="budget-usage-alert warning">
                    You're close to your budget limit.
                  </p>
                )}
              </div>
            </div>

            {/* Recent Events */}

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2>Events</h2>
              </div>

              <div className="events-highlight">
                <div className="events-highlight-icon">
                  <FaCalendarAlt />
                </div>

                <div>
                  <h3>
                    {stats.upcomingEvents > 0
                      ? `You have ${stats.upcomingEvents} upcoming event${
                          stats.upcomingEvents > 1 ? "s" : ""
                        }`
                      : "No upcoming events"}
                  </h3>

                  <p>Stay on top of your planned spending.</p>
                </div>
              </div>

              <button
                className="view-events-btn"
                onClick={() => navigate("/events")}
              >
                View Events
              </button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;



