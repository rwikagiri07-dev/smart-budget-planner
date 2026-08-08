import { useEffect, useState } from "react";

import { FaPlus, FaEdit, FaTrash, FaWallet } from "react-icons/fa";

import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";

import api from "../../services/api";

const initialForm = {
  name: "",
  category: "Food",
  amount: "",
  startDate: "",
  endDate: "",
};

function BudgetPlanner() {
  const [budgets, setBudgets] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/budgets");

      setBudgets(data.budgets || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);

    setFormData(initialForm);

    setShowModal(true);
  };

  const openEditModal = (budget) => {
    setEditingId(budget._id);

    setFormData({
      name: budget.name,

      category: budget.category,

      amount: budget.amount,

      startDate: budget.startDate?.split("T")[0] || "",

      endDate: budget.endDate?.split("T")[0] || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);

    setEditingId(null);

    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/budgets/${editingId}`, formData);

        toast.success("Budget updated successfully");
      } else {
        await api.post("/budgets", formData);

        toast.success("Budget created successfully");
      }

      closeModal();

      fetchBudgets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save budget");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/budgets/${id}`);

      toast.success("Budget deleted successfully");

      fetchBudgets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete budget");
    }
  };

  const getProgress = (budget) => {
    const amount = Number(budget.amount);
    const spent = Number(budget.spentAmount) || 0;

    if (!amount || amount <= 0) return 0;

    const progress = (spent / amount) * 100;

    if (!Number.isFinite(progress)) return 0;

    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Budget Planner</h1>

          <p>Create and manage your budgets.</p>
        </div>

        <button className="primary-btn" onClick={openAddModal}>
          <FaPlus />
          Add Budget
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading budgets...</div>
      ) : budgets.length === 0 ? (
        <div className="empty-state">
          <FaWallet />

          <h3>No Budgets Yet</h3>

          <p>Create your first budget to start managing your finances.</p>

          <button className="primary-btn" onClick={openAddModal}>
            Add Budget
          </button>
        </div>
      ) : (
        <div className="budget-grid">
          {budgets.map((budget) => {
            const progress = getProgress(budget);
            const isOverBudget =
              Number(budget.spentAmount || 0) > Number(budget.amount || 0);

            return (
              <div className="budget-card" key={budget._id}>
                <div className="budget-card-header">
                  <div>
                    <h3>{budget.name}</h3>

                    <span className="category-badge">{budget.category}</span>
                  </div>

                  <div className="action-buttons">
                    <button
                      className="icon-btn edit"
                      onClick={() => openEditModal(budget)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(budget._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="budget-amount">
                  <span>Budget</span>

                  <strong>₹{Number(budget.amount).toLocaleString()}</strong>
                </div>

                <div className="budget-progress">
                  <div className="progress-info">
                    <span>
                      Spent: ₹{Number(budget.spentAmount || 0).toLocaleString()}
                    </span>

                    <span>{Math.round(progress)}%</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className={`progress-fill${
                        isOverBudget ? " over-budget" : ""
                      }`}
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="budget-dates">
                  <span>
                    Start: {new Date(budget.startDate).toLocaleDateString()}
                  </span>

                  <span>
                    End: {new Date(budget.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Edit Budget" : "Add Budget"}</h2>

              <button onClick={closeModal} className="close-btn">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Budget Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Monthly Food"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option>Food</option>
                  <option>Travel</option>
                  <option>Shopping</option>
                  <option>Entertainment</option>
                  <option>Health</option>
                  <option>Education</option>
                  <option>Bills</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount</label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  placeholder="5000"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingId ? "Update Budget" : "Create Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default BudgetPlanner;