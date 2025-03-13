import React, { useState } from "react";
import "../styles/coding.css"; // Using one unified CSS file

const CodeEditor = () => {
  const [tabs, setTabs] = useState([
    { id: 1, language: "Python", code: "" }
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [output, setOutput] = useState("Console output will appear here...");

  // Add a new editor tab
  const addNewTab = () => {
    const newTabId = tabs.length + 1;
    setTabs([...tabs, { id: newTabId, language: "Python", code: "" }]);
    setActiveTab(newTabId);
  };

  // Close a tab and switch back
  const closeTab = (id) => {
    const filteredTabs = tabs.filter(tab => tab.id !== id);
    if (filteredTabs.length === 0) return; 

    setTabs(filteredTabs);
    
    // Automatically switch to the last remaining tab
    const lastTab = filteredTabs[filteredTabs.length - 1];
    setActiveTab(lastTab.id);
  };

  // Switch between tabs
  const switchTab = (id) => {
    setActiveTab(id);
  };

  // Update selected language
  const updateLanguage = (id, newLanguage) => {
    setTabs(tabs.map(tab => (tab.id === id ? { ...tab, language: newLanguage } : tab)));
  };

  // Update code inside the editor
  const updateCode = (id, newCode) => {
    setTabs(tabs.map(tab => (tab.id === id ? { ...tab, code: newCode } : tab)));
  };

  // Run Code (Simulated output)
  const runCode = () => {
    const selectedTab = tabs.find(tab => tab.id === activeTab);
    setOutput(`Output of ${selectedTab.language} code...`);
  };

  return (
    <div className="code-editor-container">
      
      {/* Tabs Navigation */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            className={`tab-btn ${tab.id === activeTab ? "active" : ""}`}
            onClick={() => switchTab(tab.id)}
          >
            Tab {tab.id}
            {tab.id !== 1 && ( // Show "X" button only for tabs > 1
              <span className="close-tab" onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}> ✖ </span>
            )}
          </button>
        ))}
        <button className="new-tab-btn" onClick={addNewTab}>+ New Tab</button>
      </div>

      <div className="editor-wrapper">
        {/* Left Editor */}
        <div className="editor">
          <div className="editor-header">
            <select 
              value={tabs.find(tab => tab.id === activeTab).language} 
              onChange={(e) => updateLanguage(activeTab, e.target.value)}
            >
              <option>Python</option>
              <option>JavaScript</option>
              <option>Java</option>
            </select>
            <button className="run-btn" onClick={runCode}>Run</button>
          </div>
          <textarea 
            className="code-area"
            placeholder="Write your code here..."
            value={tabs.find(tab => tab.id === activeTab).code}
            onChange={(e) => updateCode(activeTab, e.target.value)}
          />
        </div>

        {/* Right Output / Debugging Section */}
        <div className="editor">
          <div className="editor-header">
            <select disabled>
              <option>Output</option>
            </select>
            <button className="debug-btn">Debug</button>
          </div>
          <textarea className="code-area" value={output} readOnly />
        </div>
      </div>

      {/* Console Output */}
      <div className="console">
        <h3>Console Output</h3>
        <textarea className="console-area" value={output} readOnly />
      </div>

    </div>
  );
};

export default CodeEditor;
