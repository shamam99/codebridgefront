import React, { useEffect, useState } from "react";
import "../styles/coding.css";
import {
  fetchCodePages,
  createCodePage,
  deleteCodePage,
} from "../services/codePageService";
import { translateCode } from "../services/translateService";

const CodeEditor = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [translatedCode, setTranslatedCode] = useState("");
  const [toLanguage, setToLanguage] = useState("javascript");

  useEffect(() => {
    loadCodePages();
  }, []);

  const loadCodePages = async () => {
    try {
      const res = await fetchCodePages();
      const formatted = res.data.map((page) => ({
        id: page._id,
        title: page.title,
        language: page.language,
        content: page.content,
        saved: true,
      }));

      if (formatted.length > 0) {
        setTabs(formatted);
        setActiveTab(formatted[0].id);
      } else {
        createDefaultTab(); 
      }
    } catch {
      console.error("Failed to load saved code pages");
      createDefaultTab(); 
    }
  };

  const createDefaultTab = () => {
    const tempId = `Untitled-${Date.now()}`;
    const newTab = {
      id: tempId,
      title: "Untitled",
      language: "python",
      content: "",
      saved: false,
    };
    setTabs([newTab]);
    setActiveTab(tempId);
  };

  const addNewTab = () => {
    const tempId = `Untitled-${Date.now()}`;
    const newTab = {
      id: tempId,
      title: "Untitled",
      language: "python",
      content: "",
      saved: false,
    };
    setTabs([...tabs, newTab]);
    setActiveTab(tempId);
  };

  const closeTab = async (id) => {
    if (!id.includes("Untitled") && id.length < 30) {
      try {
        await deleteCodePage(id);
      } catch {
        console.error("Failed to delete from server");
      }
    }
    const updated = tabs.filter((tab) => tab.id !== id);
    setTabs(updated);
    if (updated.length > 0) setActiveTab(updated[0].id);
    else createDefaultTab(); 
  };

  const switchTab = (id) => setActiveTab(id);

  const updateLanguage = (id, lang) => {
    setTabs(
      tabs.map((tab) =>
        tab.id === id ? { ...tab, language: lang } : tab
      )
    );
  };

  const updateCode = (id, code) => {
    setTabs(
      tabs.map((tab) =>
        tab.id === id ? { ...tab, content: code } : tab
      )
    );
  };

  const runCodeHandler = async () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return;

    try {
      const res = await translateCode({
        code: tab.content,
        fromLang: tab.language,
        toLang: toLanguage,
      });

      setTranslatedCode(res.translatedCode);
    } catch (err) {
      setTranslatedCode("Translation error occurred.");
      console.error("Error translating:", err);
    }
  };

  const saveTab = async () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab || tab.saved) return;

    try {
      const res = await createCodePage({
        title: tab.title,
        language: tab.language,
        content: tab.content,
      });
      const saved = res.data.codePage;
      const updatedTabs = tabs.map((t) =>
        t.id === tab.id ? { ...t, id: saved._id, saved: true } : t
      );
      setTabs(updatedTabs);
      setActiveTab(saved._id);
    } catch {
      console.error("Failed to save tab");
    }
  };

  const active = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="code-editor-container">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${tab.id === activeTab ? "active" : ""}`}
            onClick={() => switchTab(tab.id)}
          >
            {tab.title}
            {tab.id !== tabs[0].id && (
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                ✖
              </span>
            )}
          </button>
        ))}
        <button className="new-tab-btn" onClick={addNewTab}>
          + New Tab
        </button>
        <button className="run-btn" onClick={saveTab}>
          💾 Save
        </button>
      </div>

      <div className="editor-wrapper">
        {/* Left Editor */}
        <div className="editor">
          <div className="editor-header">
            <select
              value={active?.language}
              onChange={(e) => updateLanguage(active.id, e.target.value)}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
            <button className="run-btn" onClick={runCodeHandler}>
              Run
            </button>
          </div>
          <textarea
            className="code-area"
            placeholder="Write your code here..."
            value={active?.content || ""}
            onChange={(e) => updateCode(active.id, e.target.value)}
          />
        </div>

        {/* Right Output */}
        <div className="editor">
          <div className="editor-header">
            <select
              value={toLanguage}
              onChange={(e) => setToLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
            <button className="debug-btn">Debug</button>
          </div>
          <textarea
            className="code-area"
            value={translatedCode}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
