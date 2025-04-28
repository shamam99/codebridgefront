import React, { useEffect, useState } from "react";
import "../styles/coding.css";
import {
  fetchCodePages,
  createCodePage,
  deleteCodePage,
} from "../services/codePageService";
import { translateCode, runCode, debugCode } from "../services/translateService";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { EditorView, Decoration, ViewPlugin } from "@codemirror/view";
import { getStoredToken } from "../services/authService";
const CodeEditor = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [translatedCode, setTranslatedCode] = useState("");
  const [toLanguage, setToLanguage] = useState("javascript");
  const [runOutput, setRunOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [errorLine, setErrorLine] = useState(null);
  const [debugOutput, setDebugOutput] = useState("");
  const [debugCollapsed, setDebugCollapsed] = useState(false);
  const [historyTabs, setHistoryTabs] = useState([]);
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingTabData, setPendingTabData] = useState(null); 
  const [newTabTitle, setNewTabTitle] = useState("");


  useEffect(() => {
    loadCodePages();
  }, []);

  const loadCodePages = async () => {
    try {
      const res = await fetchCodePages();
      const allTabs = res.map((page) => ({
        id: page._id,
        title: page.title,
        language: page.language,
        content: page.content,
        saved: true,
      }));
  
      // Separate saved tabs from current active session
      setHistoryTabs(allTabs);
      if (allTabs.length > 0) {
        setTabs([allTabs[0]]);
        setActiveTab(allTabs[0].id);
      } else {
        createDefaultTab();
      }
    } catch (err) {
      console.error("Error loading tabs", err);
      createDefaultTab();
    }
  };

  const createDefaultTab = () => {
    setPendingTabData({
      id: `temp-${Date.now()}`,
      language: "python",
      content: "",
      saved: false,
    });
    setNewTabTitle("");
    setShowNameModal(true);
  };

  const addNewTab = () => {
    setPendingTabData({
      id: `Untitled-${Date.now()}`,
      language: "python",
      content: "",
      saved: false,
    });
    setNewTabTitle(""); // reset input
    setShowNameModal(true);
  };

  const confirmNewTab = () => {
    if (!newTabTitle.trim()) return;
  
    const newTab = {
      ...pendingTabData,
      title: newTabTitle,
    };
  
    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newTab.id);
    setShowNameModal(false);
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

  const translateCodeHandler = async () => {
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

  const runCodeHandler = async () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return;
  
    setIsRunning(true);
    setRunOutput("Running...");
    setErrorLine(null); // Reset before run
  
    try {
      const res = await runCode({
        code: tab.content,
        language: tab.language,
      });
  
      setRunOutput(res.output);
  
      // Extract line number if exists
      const match = res.output.match(/line (\d+)/i);
      if (match) {
        setErrorLine(parseInt(match[1], 10));
      }
    } catch (err) {
      if (err.response?.data?.output) {
        const output = err.response.data.output;
        setRunOutput(output);
  
        const match = output.match(/line (\d+)/i);
        if (match) {
          setErrorLine(parseInt(match[1], 10));
        }
      } else {
        setRunOutput("Run error occurred:\n" + err.message);
      }
    } finally {
      setIsRunning(false);
    }
  };
  

  const debugCodeHandler = async () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return;
  
    setDebugOutput("Debugging...");
  
    try {
      const res = await debugCode({
        code: tab.content,
        language: tab.language,
      });
  
      console.log("DEBUG RESPONSE:", res); // must delete it for the server
  
      if (res.debugOutput) {
        setDebugOutput(res.debugOutput);
      } else {
        setDebugOutput("No debug info returned.");
      }
    } catch (err) {
      setDebugOutput("Debug error: " + err.message);
    }
  };
  
  
  const errorLinePlugin = (lineNumber) =>
    ViewPlugin.fromClass(class {
      decorations;
      constructor(view) {
        const deco = Decoration.line({
          attributes: { class: "cm-error-line" }
        });
        const line = view.state.doc.line(lineNumber);
        this.decorations = Decoration.set([deco.range(line.from)]);
      }
      update() {}
    }, {
      decorations: v => v.decorations
    });


    const saveTab = async () => {
      const tab = tabs.find((t) => t.id === activeTab);
      if (!tab || tab.saved) return;
    
      try {
        const res = await createCodePage({
          title: tab.title,
          language: tab.language,
          content: tab.content,
        });
        const saved = res.codePage;
    
        const updatedTabs = tabs.map((t) =>
          t.id === tab.id ? { ...t, id: saved._id, saved: true } : t
        );
    
        setTabs(updatedTabs);
        setActiveTab(saved._id);
    
        // 🟩 Refresh history after save
        const history = await fetchCodePages();
        const formatted = history.map((page) => ({
          id: page._id,
          title: page.title,
          language: page.language,
          content: page.content,
          saved: true,
        }));
        setHistoryTabs(formatted);
      } catch (err) {
        console.error("Failed to save tab", err);
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
        <button
          className="save-tab-btn"
          onClick={() => {
            if (isVisitor) return openVisitorModal();
            saveTab();
          }}
        >
          💾 Save
        </button>
      </div>
  
      <div className="editor-wrapper">
        {/* Left Side: Main Editor */}
        <div className="left-editor-panel">
        <div className="left-editor-header">
          <select
            value={active?.language}
            onChange={(e) => updateLanguage(active.id, e.target.value)}
            className="small-dropdown"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>

          {/* 🟰 Group the buttons inside a new container */}
          <div className="left-editor-buttons">
            <button className="run-btn" onClick={runCodeHandler}>
              ▶️ Run
            </button>
            <button className="translate-btn" onClick={translateCodeHandler}>
              🔄 Translate
            </button>
          </div>
        </div>

  
          <CodeMirror
            value={active?.content || ""}
            height="250px"
            theme="light"
            extensions={[
              active?.language === "javascript" ? javascript() : python(),
              errorLine !== null ? errorLinePlugin(errorLine) : null
            ].filter(Boolean)}
            onChange={(value) => updateCode(active.id, value)}
            basicSetup={{ lineNumbers: true, highlightActiveLine: true }}
            style={{ fontFamily: "monospace", fontSize: "14px" }}
          />
  
          <div className="left-console">
            <h3>Console Output:</h3>
            <textarea
              className={`left-console-area ${
                runOutput.startsWith("SyntaxError") ||
                runOutput.startsWith("ReferenceError") ||
                runOutput.startsWith("TypeError")
                  ? "error-output"
                  : ""
              }`}
              readOnly
              value={runOutput}
            />
          </div>
        </div>
  
        {/* Right Side: Output & Debug */}
        <div className="right-output-panel">
        <div className="right-editor-header">
          <select
            value={toLanguage}
            onChange={(e) => setToLanguage(e.target.value)}
            className="small-dropdown"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>

          <button className="debug-btn" onClick={debugCodeHandler}>
            🔍 Debug
          </button>
        </div>
            <textarea
              className="translated-code-area"
              value={translatedCode}
              readOnly
            />
            <div className="debug-section">
            <div className="debug-header" onClick={() => setDebugCollapsed(!debugCollapsed)}>
              <h4>Debug Output:</h4>
              <span className="toggle-debug">
                {debugCollapsed ? "🔽 Show" : "🔼 Hide"}
              </span>
            </div>
            {!debugCollapsed && (
              <textarea
                className="debug-console-area"
                readOnly
                value={debugOutput}
                style={{
                  height: "120px",
                  overflowY: "scroll",
                  whiteSpace: "pre-wrap",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {historyTabs.length > 0 && (
        <div className="history-section">
          <h3>Saved History</h3>
          {historyTabs.map((tab) => (
            <div key={tab.id} className="history-tab">
              <div className="history-tab-info">
                <span>{tab.title}</span> <code>({tab.language})</code>
              </div>
              <div className="history-tab-buttons">
                <button
                  className="load-history-btn"
                  onClick={() => {
                    const tempId = `history-${Date.now()}`;
                    const historyCopy = {
                      ...tab,
                      id: tempId,
                      saved: false,
                    };
                    setTabs([...tabs, historyCopy]);
                    setActiveTab(tempId);
                  }}
                >
                  Load
                </button>
                <button
                  className="delete-history-btn"
                  onClick={async () => {
                    try {
                      await deleteCodePage(tab.id);
                      const history = await fetchCodePages();
                      const formatted = history.map((page) => ({
                        id: page._id,
                        title: page.title,
                        language: page.language,
                        content: page.content,
                        saved: true,
                      }));
                      setHistoryTabs(formatted);
                    } catch (err) {
                      console.error("Failed to delete history tab", err);
                    }
                  }}
                >
                  🗑️ 
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNameModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Name Your New Tab</h3>
            <input
              type="text"
              value={newTabTitle}
              onChange={(e) => setNewTabTitle(e.target.value)}
              placeholder="Enter tab name"
            />
            <div className="modal-buttons">
              <button onClick={confirmNewTab}>Confirm</button>
              <button onClick={() => setShowNameModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )} 
    </div>
  );
  
};

export default CodeEditor;
