import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/Logo.png";
import Modal from "./Modal";
import Login from "../pages/Login";
import Register from "../pages/Register"; 

const Navbar = () => {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); 

  // Function to switch from Register to Login
  const switchToLogin = () => {
    setShowRegister(false); 
    setTimeout(() => setShowLogin(true), 300);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Code Bridge Logo" className="logo" />
          <span className="site-name">Code Bridge</span>
        </div>
        
        <ul className="nav-links">
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">Home</Link>
          </li>
          <li className={location.pathname === "/coding" ? "active" : ""}>
            <Link to="/coding">Coding</Link>
          </li>
          <li className={location.pathname === "/resources" ? "active" : ""}>
            <Link to="/resources">Resources</Link>
          </li>
          <li className={location.pathname === "/community" ? "active" : ""}>
            <Link to="/community">Community</Link>
          </li>
        </ul>

        {/* Authentication Section */}
        <div className="auth-links">
          <button
            className="register-link"
            onClick={() => setShowRegister(true)}
            style={{
              background: "none",
              border: "none",
              fontSize: "16px",
              fontWeight: "500",
              color: "black",
              cursor: "pointer",
            }}
          >
            Register
          </button>
          <span> | </span>
          <button
            className="login-link"
            onClick={() => setShowLogin(true)}
            style={{
              background: "none",
              border: "none",
              fontSize: "16px",
              fontWeight: "500",
              color: "#6C51B3",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Login Modal */}
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <Login />
      </Modal>

      {/* Register Modal with switchToLogin function */}
      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
        <Register onSwitchToLogin={switchToLogin} />
      </Modal>
    </>
  );
};

export default Navbar;
