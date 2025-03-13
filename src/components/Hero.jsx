import React from "react";
import "../styles/hero.css";
import HomeGirl from "../assets/HomeGirl.png";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="learning-badge">Never Stop Learning</span>
        <h1>Grow up your skills by learning coding with <span className="highlight">Code Bridge</span></h1>
        <p>Start your journey in coding today and become an expert in multiple languages.</p>
        <div className="subscribe-box">
          <input type="email" placeholder="Enter your email here..." />
          <button className="subscribe-btn">Subscribe</button>
        </div>
      </div>
      <div className="hero-image">
        <img src={HomeGirl} alt="Home illustration" />
      </div>
    </section>
  );
};

export default Hero;
