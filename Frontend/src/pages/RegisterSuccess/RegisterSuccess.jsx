import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../Register/Register.css";

export default function RegisterSuccess() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleResend = async () => {
    setError("");
    setMessage("");

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Không thể gửi lại email xác nhận");
      }

      setMessage("✅ Email xác nhận đã được gửi lại! Vui lòng kiểm tra hộp thư.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="logo-section">
        <div className="logo-placeholder">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <div className="form-section">
        <div className="register-box">
          <h2>ĐĂNG KÝ THÀNH CÔNG 🎉</h2>
          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            Vui lòng kiểm tra email của bạn để xác thực tài khoản trước khi đăng nhập.
          </p>

          {/* Nút gửi lại email xác nhận nằm trên */}
          

          {/* Thông báo */}
          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}

          {/* Nút quay lại đăng nhập nằm dưới */}
          <Link to="/login">
            <button className="login-btn">Quay lại đăng nhập</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
