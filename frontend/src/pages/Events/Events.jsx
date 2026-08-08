import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const initialForm = {
  title: "",
  date: "",
  budget: "",
  description: "",
};

function Events() {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/events");

      setEvents(data.events || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load events");
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

  const openEditModal = (event) => {
    setEditingId(event._id);

    setFormData({
      title: event.title || "",
      date: event.date?.split("T")[0] || "",
      budget: event.budget || "",
      description: event.description || "",
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
        await api.put(`/events/${editingId}`, formData);

        toast.success("Event updated successfully");
      } else {
        await api.post("/events", formData);

        toast.success("Event created successfully");
      }

      closeModal();

      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/events/${id}`);

      toast.success("Event deleted successfully");

      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemaining = (date) => {
    if (!date) return null;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(date);

    eventDate.setHours(0, 0, 0, 0);

    const difference = eventDate.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Events</h1>

          <p>Plan upcoming events and manage their budgets.</p>
        </div>

        <button className="primary-btn" onClick={openAddModal}>
          <FaPlus />
          Add Event
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <FaCalendarAlt />

          <h3>No Events Yet</h3>

          <p>Create an event to start planning your expenses.</p>

          <button className="primary-btn" onClick={openAddModal}>
            Add Event
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            const daysRemaining = getDaysRemaining(event.date);

            return (
              <div className="event-card" key={event._id}>
                <div className="event-card-top">
                  <div className="event-icon">
                    <FaCalendarAlt />
                  </div>

                  <div className="action-buttons">
                    <button
                      className="icon-btn edit"
                      onClick={() => openEditModal(event)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(event._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <h3>{event.title}</h3>

                <div className="event-date">{formatDate(event.date)}</div>

                {daysRemaining !== null && (
                  <div
                    className={
                      daysRemaining < 0
                        ? "event-status past"
                        : daysRemaining === 0
                          ? "event-status today"
                          : "event-status upcoming"
                    }
                  >
                    {daysRemaining < 0
                      ? "Past event"
                      : daysRemaining === 0
                        ? "Today"
                        : `${daysRemaining} day${
                            daysRemaining === 1 ? "" : "s"
                          } remaining`}
                  </div>
                )}

                <div className="event-budget">
                  <span>Event Budget</span>

                  <strong>₹{Number(event.budget || 0).toLocaleString()}</strong>
                </div>

                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Edit Event" : "Add Event"}</h2>

              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Name</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Birthday"
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
                <label>Budget</label>

                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="10000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the event..."
                  rows="4"
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
                  {editingId ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Events;
