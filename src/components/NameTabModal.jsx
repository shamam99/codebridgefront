import React from "react";

const NameTabModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = React.useState("");

  const handleSubmit = () => {
    onSave(name);
    setName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Name your new tab</h3>
        <input
          type="text"
          placeholder="Enter title..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NameTabModal;
