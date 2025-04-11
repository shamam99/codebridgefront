import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CodeConverter from "../components/CodeConverter"; 
import Community from "./Community";
import Footer from "../components/Footer";



const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <CodeConverter />
      <Footer />
      {/* Ensure the modal can render inside this page */}
      <div id="modal-root"></div>
    </>
  );
};

export default Home;
