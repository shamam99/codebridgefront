import React from "react";
import "../styles/auth.css";
import registerIllustration from "../assets/codeRegister.png";
import google from "../assets/google.png";

const Register = ({ onSwitchToLogin }) => {
  return (
    <div className="register-container">
      <div className="register-left">
        <h2>Welcome to Code Bridge online Platform</h2>
        <img src={registerIllustration} alt="Register Illustration" />
      </div>
      <div className="register-divider"></div>
      <div className="register-right">
        <button className="register-google">
          <img src={google} alt="Google Logo" />
          Sign up with Google
        </button>
        <p className="register-or-text">— Or signup with your email —</p>
        <form>
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
          <div className="register-options">
            <div className="register-checkbox">
              <input type="checkbox" id="termsConditions" />
              <label htmlFor="termsConditions">
                I agree to the <a href="#">Terms & Conditions</a>
              </label>
            </div>
          </div>
          <button className="register-btn">Sign Up</button>
          <p className="register-signin-link">
            Already have an account? 
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
