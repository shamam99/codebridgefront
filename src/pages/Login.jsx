import React, { useState } from "react";
import "../styles/auth.css";
import loginGirl from "../assets/loginGirl.png";
import google from "../assets/google.png";
import { loginUser } from "../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
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
        <button className="google-login">
          <img src={google} alt="Google" />
          Sign in with Google
        </button>
        <p className="or-text">— Or sign in with your email —</p>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="signin-btn">Sign In</button>
          <div className="auth-options">
            <div className="keep-signed-in">
              <input type="checkbox" id="keepSignedIn" />
              <label htmlFor="keepSignedIn">Keep me signed in</label>
            </div>
            <a href="#">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
