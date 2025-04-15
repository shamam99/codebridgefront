import React, { useState } from "react";
import "../styles/auth.css";
import registerIllustration from "../assets/codeRegister.png";
import { registerUser } from "../services/authService";

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);
      localStorage.setItem("token", data.token);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h2>Welcome to Code Bridge online Platform</h2>
        <img src={registerIllustration} alt="Register Illustration" />
      </div>
      <div className="register-divider"></div>
      <div className="register-right">
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="register-options">
            <div className="register-checkbox">
              <input type="checkbox" id="termsConditions" />
              <label htmlFor="termsConditions">
                I agree to the <a href="#">Terms & Conditions</a>
              </label>
            </div>
          </div>
          <button type="submit" className="register-btn">Sign Up</button>
          <p className="register-signin-link">
            Already have an account?{" "}
            <button
              className="switch-to-login"
              onClick={onSwitchToLogin}
              style={{
                background: "none",
                border: "none",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
