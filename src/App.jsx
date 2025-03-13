import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Coding from "./pages/Coding"; // Import the Coding page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/coding" element={<Coding />} /> {/* Ensure Coding Page is linked */}
    </Routes>
  );
}

export default App;
