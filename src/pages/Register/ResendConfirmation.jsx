import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Register.css"; // có thể tái sử dụng css của register

export default function ResendConfirmation() {
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
        headers: {
          "Content-Type": "application/json",
        },
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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "GỬI LẠI"}
            </button>
          </form>

          <p>
            Quay lại <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
