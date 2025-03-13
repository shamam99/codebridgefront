import React from "react";
import "../styles/auth.css";
import loginGirl from "../assets/loginGirl.png";
import google from "../assets/google.png";


const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Welcome to Code Bridge online Platform</h2>
        <img src={loginGirl} alt="Login Illustration" />
      </div>
      <div className="divider"></div>
      <div className="auth-right">
        <button className="google-login">
        <img src={google} alt="google Illustration" />
          Sign in with Google
        </button>
        <p className="or-text">— Or sign in with your email —</p>
        <form>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
          <button className="signin-btn">Sign In</button>
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
