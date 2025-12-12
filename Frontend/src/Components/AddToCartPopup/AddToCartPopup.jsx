// src/components/AddToCartPopup.jsx
import React, { useEffect } from "react";
import "./AddToCartPopup.css";

export default function AddToCartPopup({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2000); // Tự ẩn sau 2s
    return () => clearTimeout(timer);
  }, [onClose]);

  const renderIcon = () => {
    switch (type) {
      case "success":
        return <div className="checkmark">✔</div>;
      case "error":
        return <div className="cross">✖</div>;
      case "warn":
        return <div className="warning">⚠️</div>;
      default:
        return <div className="info">ℹ️</div>;
    }
  };

  return (
    <div className={`popup-overlay ${type}`}>
      <div className={`popup-box ${type}`}>
        {renderIcon()}
        <p>{message}</p>
      </div>
    </div>
  );
}
