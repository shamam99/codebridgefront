import React from "react";
import "../styles/CodeConverter.css"; // Add a separate CSS file for styles
import jsIcon from "../assets/js.png";
import pythonIcon from "../assets/python.png";

const CodeConverter = () => {
  return (
    <section className="coding-section">
      <div className="coding-content">
        <h2>
          Learn coding online with <span className="highlight">Code Bridge</span>
        </h2>
        <p>One website to move from one language to another easily</p>

        <div className="search-bar">
          <input type="text" placeholder="Start writing here..." disabled />
        </div>

        <div className="categories">
          <span className="category active">Programming</span>
          <span className="category">Web</span>
          <span className="category">Database</span>
        </div>

        <div className="language-icons">
          <div className="lang">
            <img src={jsIcon} alt="JavaScript" />
            <span>JavaScript</span>
          </div>
          <div className="lang">
            <img src={pythonIcon} alt="Python" />
            <span>Python</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeConverter;
