import { useEffect, useState } from "react";

import { FaUser, FaLock, FaPalette, FaSignOutAlt } from "react-icons/fa";

import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import { useAuth } from "../../context/AuthContext";

function Settings() {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currency: "INR",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        currency: user.currency || "INR",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put("/auth/profile", {
        name: profile.name,
        currency: profile.currency,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");

      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must contain at least 6 characters");

      return;
    }

    try {
      setPasswordLoading(true);

      await api.put("/auth/change-password", {
        currentPassword: passwords.currentPassword,

        newPassword: passwords.newPassword,
      });

      toast.success("Password changed successfully");

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Settings</h1>

          <p>Manage your account and preferences.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* PROFILE */}

        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <FaUser />
            </div>

            <div>
              <h2>Profile</h2>

              <p>Update your personal information.</p>
            </div>
          </div>

          <form onSubmit={saveProfile}>
            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input type="email" value={profile.email} disabled />
            </div>

            <div className="form-group">
              <label>Currency</label>

              <select
                name="currency"
                value={profile.currency}
                onChange={handleProfileChange}
              >
                <option value="INR">₹ Indian Rupee (INR)</option>

                <option value="USD">$ US Dollar (USD)</option>

                <option value="EUR">€ Euro (EUR)</option>

                <option value="GBP">£ British Pound (GBP)</option>

                <option value="JPY">¥ Japanese Yen (JPY)</option>
              </select>
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </section>

        {/* PASSWORD */}

        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon password">
              <FaLock />
            </div>

            <div>
              <h2>Change Password</h2>

              <p>Keep your account secure.</p>
            </div>
          </div>

          <form onSubmit={changePassword}>
            <div className="form-group">
              <label>Current Password</label>

              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>

              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                minLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </section>

        {/* PREFERENCES */}

        {/* <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon theme">
              <FaPalette />
            </div>

            <div>
              <h2>Preferences</h2>

              <p>Customize your experience.</p>
            </div>
          </div>

          <div className="preference-row">
            <div>
              <strong>Theme</strong>

              <span>Choose your preferred theme.</span>
            </div>

            <select
              defaultValue="light"
              onChange={(e) => {
                document.documentElement.setAttribute(
                  "data-theme",
                  e.target.value,
                );
              }}
            >
              <option value="light">Light</option>

              <option value="dark">Dark</option>
            </select>
          </div>
        </section> */}

        {/* ACCOUNT */}

        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon logout">
              <FaSignOutAlt />
            </div>

            <div>
              <h2>Account</h2>

              <p>Manage your current session.</p>
            </div>
          </div>

          <button className="logout-settings-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
