import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"
import "../Register/Register.css";

export default function RegisterSuccess() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleResend = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

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

      setMessage("✅ Email xác nhận đã được gửi lại! Vui lòng kiểm tra hộp thư.");
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

      {/* Nội dung chính */}
      <div className="form-section">
        <div className="register-box">
          <h2>ĐĂNG KÝ THÀNH CÔNG 🎉</h2>
          <p>
            Vui lòng kiểm tra email của bạn để xác thực tài khoản trước khi đăng nhập.
          </p>

          {/* Form gửi lại email xác nhận */}
          <form onSubmit={handleResend} style={{ marginTop: "20px" }}>
            <input
              type="email"
              placeholder="Nhập email để gửi lại xác nhận"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi lại email xác nhận"}
            </button>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {message && <p style={{ color: "green" }}>{message}</p>}

          <br />
          <Link to="/login">
            <button>Quay lại đăng nhập</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
