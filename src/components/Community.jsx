import React from "react";
import "../styles/community.css";
import CodeImage1 from "../assets/code1.png";
import CodeImage2 from "../assets/code2.png";

const Community = () => {
  return (
    <section className="community">
      <div className="community-content">
        <h2>Join large developer community</h2>
        <p>
          Collaborate on Cheatsheets, Tutorials. Write Posts, answer questions
          to help developer community
        </p>
        <a href="#" className="join-link">
          Join Now →
        </a>
      </div>
      <div className="community-images">
        <img src={CodeImage1} alt="Community Collaboration" className="code-img1" />
        <img src={CodeImage2} alt="Community Collaboration" className="code-img2" />
      </div>
    </section>
  );
};

export default Community;
