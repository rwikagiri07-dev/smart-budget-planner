import { FaBars } from "react-icons/fa";

function Navbar({ onMenuClick }) {
  return (
    <header className="navbar">
      <button
        type="button"
        className="menu-btn"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <FaBars />
      </button>

      <div className="navbar-title">
        <h2>Smart Budget Planner</h2>
      </div>

      <div className="profile">Welcome 👋</div>
    </header>
  );
}

export default Navbar;
