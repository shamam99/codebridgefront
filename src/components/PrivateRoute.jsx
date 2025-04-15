import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  // If user is authenticated, render the child
  if (isAuthenticated()) return children;

  // Save attempted route to localStorage or state if needed
  localStorage.setItem("redirectAfterLogin", location.pathname);

  // Redirect to home (login modal will show up from there)
  return <Navigate to="/" />;
};

export default PrivateRoute;
