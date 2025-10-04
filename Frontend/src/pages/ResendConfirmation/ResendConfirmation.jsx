import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../Register/Register.css";

export default function ResendConfirmation() {
  const location = useLocation();
  const initialEmail = location.state?.email || ""; // nhận email từ Login nếu có
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleResend = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // ✅ Validate email
    if (!email.trim()) {
      setError("Vui lòng nhập email!");
      return;
    }
    if (!email.endsWith(".com")) {
      setError("Email không hợp lệ! Cần có đuôi .com");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Không thể gửi lại email xác nhận");
      }

      setMessage("Email xác nhận đã được gửi lại! Vui lòng kiểm tra hộp thư.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Logo bên trái */}
      <div className="logo-section">
        <div className="logo-placeholder">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      {/* Form gửi lại email */}
      <div className="form-section">
        <div className="register-box">
          <h2>GỬI LẠI EMAIL XÁC NHẬN</h2>
          <form onSubmit={handleResend}>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "GỬI LẠI"}
            </button>
          </form>

          <p style={{ marginTop: "10px" }}>
            Quay lại <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
