import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/Logo.png";
import profileImage from "../assets/profileImage.jpg";
import Modal from "./Modal";
import Login from "../pages/Login";
import Register from "../pages/Register";
import API from "../services/axiosInstance";

const Navbar = () => {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // On mount: check token and fetch full profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setIsLoggedIn(true);
        fetchFullUserProfile();
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, []);

  const fetchFullUserProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data); // contains name, avatar, etc.
    } catch (err) {
      console.error("Failed to fetch profile for navbar", err);
    }
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setTimeout(() => setShowLogin(true), 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
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
          <li className={location.pathname === "/profile" ? "active" : ""}>
            <Link to="/profile">Profile</Link>
          </li>
          <li className={location.pathname === "/community" ? "active" : ""}>
            <Link to="/community">Community</Link>
          </li>
        </ul>

        {/* Auth Section */}
        <div className="auth-links">
          {isLoggedIn ? (
            <>
              <img
                src={user?.avatar || profileImage}
                alt="User"
                className="profile-pic"
                title={user?.name || "Logged In"}
              />
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "10px",
                  background: "none",
                  border: "none",
                  color: "#6C51B3",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <Login />
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
        <Register onSwitchToLogin={switchToLogin} />
      </Modal>
    </>
  );
};

export default Navbar;
