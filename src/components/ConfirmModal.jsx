import React from "react";
import "../styles/confirmModal.css";

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
