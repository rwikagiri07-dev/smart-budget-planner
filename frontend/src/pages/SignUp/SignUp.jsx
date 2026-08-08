import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await register(formData.name, formData.email, formData.password);

      toast.success("Account created successfully");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-info">
        <div className="auth-bars" aria-hidden="true">
          <span className="auth-bar" style={{ "--h": "38%" }}></span>
          <span className="auth-bar" style={{ "--h": "62%" }}></span>
          <span className="auth-bar" style={{ "--h": "50%" }}></span>
          <span className="auth-bar" style={{ "--h": "80%" }}></span>
          <span className="auth-bar" style={{ "--h": "68%" }}></span>
        </div>

        <span className="auth-eyebrow">Smart Budget Planner</span>

        <h2>Every rupee, accounted for.</h2>

        <p>
          Plan budgets, track everyday expenses, and stay ahead of upcoming
          financial events, all from one simple dashboard built to keep your
          money in view.
        </p>

        <ul className="auth-info-list">
          <li>Plan and manage monthly budgets with ease</li>
          <li>Track expenses in real time</li>
          <li>Stay ahead of bills and financial events</li>
          <li>Visual reports to understand your spending habits</li>
        </ul>
      </div>

      <div className="auth-card">
        <h1>Create your account</h1>

        <p className="auth-subtitle">Get started in under a minute</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
