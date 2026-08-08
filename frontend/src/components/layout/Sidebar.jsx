import {
  FaHome,
  FaWallet,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigation = () => {
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">💰 Smart Budget Planner</div>

        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <FaTimes />
        </button>
      </div>

      <nav>
        <NavLink to="/dashboard" onClick={handleNavigation}>
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/budgets" onClick={handleNavigation}>
          <FaWallet />
          <span>Budget Planner</span>
        </NavLink>

        <NavLink to="/expenses" onClick={handleNavigation}>
          <FaMoneyBillWave />
          <span>Expenses</span>
        </NavLink>

        <NavLink to="/events" onClick={handleNavigation}>
          <FaCalendarAlt />
          <span>Events</span>
        </NavLink>

        <NavLink to="/reports" onClick={handleNavigation}>
          <FaChartBar />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/settings" onClick={handleNavigation}>
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />

        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
