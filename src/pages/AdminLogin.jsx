import React, { useState } from "react";
import "../styles/adminLogin.css";
import { useNavigate } from "react-router-dom";
import adminService from "../services/adminService";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { token } = await adminService.loginAdmin(formData.email, formData.password);
      localStorage.setItem("adminToken", token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <div className="admin-login-icon">
          <i className="fas fa-user-circle"></i>
        </div>
        <h2 className="admin-login-title">Admin Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="admin-login-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" className="forgot-link">Forgot Password?</a>
        </div>

        {error && <p className="admin-login-error">{error}</p>}

        <button type="submit" className="admin-login-btn">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
