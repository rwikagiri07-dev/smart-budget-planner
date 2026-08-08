import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaMoneyBillWave,
} from "react-icons/fa";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const initialForm = {
  title: "",
  category: "Food",
  amount: "",
  date: "",
  notes: "",
};

function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, [page, search, category]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", 10);

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (category) {
        params.append("category", category);
      }

      const { data } = await api.get(`/expenses?${params.toString()}`);

      setExpenses(data.expenses || []);

      setTotalPages(data.pages || 1);

      setTotalExpenses(data.total || 0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load expenses");
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

    setFormData({
      ...initialForm,
      date: new Date().toISOString().split("T")[0],
    });

    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setEditingId(expense._id);

    setFormData({
      title: expense.title || "",
      category: expense.category || "Food",
      amount: expense.amount || "",
      date: expense.date?.split("T")[0] || "",
      notes: expense.notes || "",
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
        await api.put(`/expenses/${editingId}`, formData);

        toast.success("Expense updated successfully");
      } else {
        await api.post("/expenses", formData);

        toast.success("Expense added successfully");
      }

      closeModal();

      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save expense");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/expenses/${id}`);

      toast.success("Expense deleted successfully");

      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Expenses</h1>

          <p>Track and manage your spending.</p>
        </div>

        <button className="primary-btn" onClick={openAddModal}>
          <FaPlus />
          Add Expense
        </button>
      </div>

      <div className="expense-summary">
        <div>
          <span>Total Expenses</span>

          <strong>{totalExpenses}</strong>
        </div>
      </div>

      <div className="expense-toolbar">
        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>

          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading expenses...</div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <FaMoneyBillWave />

          <h3>No Expenses Found</h3>

          <p>Add an expense to start tracking your spending.</p>

          <button className="primary-btn" onClick={openAddModal}>
            Add Expense
          </button>
        </div>
      ) : (
        <>
          <div className="expense-table-wrapper">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td data-label="Title">
                      <strong>{expense.title}</strong>
                    </td>

                    <td data-label="Category">
                      <span className="category-badge">{expense.category}</span>
                    </td>

                    <td data-label="Amount" className="expense-amount">
                      ₹{Number(expense.amount || 0).toLocaleString()}
                    </td>

                    <td data-label="Date">{formatDate(expense.date)}</td>

                    <td data-label="Notes">{expense.notes || "-"}</td>

                    <td data-label="Actions">
                      <div className="action-buttons">
                        <button
                          className="icon-btn edit"
                          onClick={() => openEditModal(expense)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="icon-btn delete"
                          onClick={() => handleDelete(expense._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>

              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Dinner"
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
                  step="0.01"
                  placeholder="500"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Notes</label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional notes..."
                  rows="3"
                />
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
                  {editingId ? "Update Expense" : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Expenses;
