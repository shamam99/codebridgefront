// 📁 src/pages/Login.jsx
import React, { useState } from "react";
import "../styles/auth.css";
import loginGirl from "../assets/loginGirl.png";
import { loginUser } from "../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/.+@.+\..+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = await loginUser(formData);
      if (rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Welcome to Code Bridge online Platform</h2>
        <img src={loginGirl} alt="Login Illustration" />
      </div>
      <div className="divider"></div>
      <div className="auth-right">
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <small className="error">{errors.email}</small>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <small className="error">{errors.password}</small>}

          <div className="auth-options">
            <div className="keep-signed-in">
              <input
                type="checkbox"
                id="keepSignedIn"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="keepSignedIn">Keep me signed in</label>
            </div>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="signin-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
