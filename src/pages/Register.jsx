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
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);

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
  
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[\p{L}\s'-]+$/u.test(formData.name)) {
      newErrors.name = "Name must contain only letters.";
    }
  
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/.+@.+\..+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
  
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6 || formData.password.length > 10) {
      newErrors.password = "Password must be 6–10 characters.";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain letters and numbers.";
    }
  
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the Terms & Conditions.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = await registerUser(formData);
      localStorage.setItem("token", data.token);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed.");
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
          {errors.name && <small className="error">{errors.name}</small>}

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

          <div className="register-options">
            <div className="register-checkbox">
              <input
                type="checkbox"
                id="termsConditions"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
              />
              <label htmlFor="termsConditions">
                I agree to the <a href="#">Terms & Conditions</a>
              </label>
            </div>
            {errors.terms && <small className="error">{errors.terms}</small>}
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
