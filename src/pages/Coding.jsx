import React from "react";
import "../styles/coding.css"; 
import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/Navbar"; 

const Coding = () => {
  return (
    <>
      <Navbar />  {/* Navbar at the top */}
      <div className="coding-container">
        <div className="editor-section">
          <CodeEditor />
        </div>
      </div>
    </>
  );
};

export default Coding;
