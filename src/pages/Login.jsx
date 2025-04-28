import React, { useState } from "react";
import "../styles/auth.css";
import loginGirl from "../assets/loginGirl.png";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";


const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  // Live validate
  let fieldError = {};

  if (name === "name") {
    if (!value.trim()) {
      fieldError.name = "Name is required.";
    } else if (!/^[\p{L}\s'-]+$/u.test(value)) {
      fieldError.name = "Name must contain only letters.";
    } else {
      fieldError.name = "";
    }
  }

  if (name === "email") {
    if (!value.trim()) {
      fieldError.email = "Email is required.";
    } else if (!/.+@.+\..+/.test(value)) {
      fieldError.email = "Invalid email format.";
    } else {
      fieldError.email = "";
    }
  }

  if (name === "password") {
    if (!value.trim()) {
      fieldError.password = "Password is required.";
    } else if (value.length < 6 || value.length > 10) {
      fieldError.password = "Password must be 6–10 characters.";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
      fieldError.password = "Password must contain letters and numbers.";
    } else {
      fieldError.password = "";
    }
  }

  setErrors(prevErrors => ({ ...prevErrors, ...fieldError }));
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
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", data.token);
        localStorage.removeItem("token");
      }      
      navigate("/profile"); // Redirect after successful login
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

          <p className="register-signin-link">
            Don't have an account?{" "}
            <button
              className="switch-to-login"
              onClick={onSwitchToRegister}
              style={{
                background: "none",
                border: "none",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                color: "#6C51B3"
              }}
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
