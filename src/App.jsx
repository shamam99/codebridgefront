import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Coding from "./pages/Coding";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import PrivateRoute from "./components/PrivateRoute"; 
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/coding" element={<Coding />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route
        path="/community"
        element={
          <PrivateRoute>
            <Community />
          </PrivateRoute>
        }
      />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
    
  );
}

export default App;
