import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // hiển thị lỗi
  const [showPassword, setShowPassword] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false); // show resend

  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setShowResendButton(false);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        // Nếu tài khoản chưa kích hoạt
        if (res.status === 403 && data.message?.includes("chưa được kích hoạt")) {
          setError("Tài khoản chưa được kích hoạt!");
          setShowResendButton(true); // hiện nút gửi lại email
        } else if (res.status === 404 && data.code === 203) {
          setError("Sai tên tài khoản hoặc mật khẩu");
        } else {
          setError(data.message || "Đăng nhập thất bại!");
        }
        return;
      }

      // Nếu login thành công
      const { accessToken, email: userEmail, role } = data.data;
      login(accessToken, { email: userEmail, role });
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      
    } catch (err) {
      console.error("❌ Lỗi fetch:", err);
      setError("Không thể kết nối tới server!");
    }
  };

  return (
    <div className="login-container">
      <div className="logo-section">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
      </div>
      <div className="form-section">
        <div className="login-box">
          <h2>ĐĂNG NHẬP</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit">ĐĂNG NHẬP</button>
          </form>

          {error && (
            <p style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
              {error}
            </p>
          )}

          {/* Hiển thị nút gửi lại email khi tài khoản chưa kích hoạt */}
          {showResendButton && (
            <button
              style={{
                marginTop: "10px",
                backgroundColor: "#f0ad4e",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                color: "#fff",
              }}
              onClick={() => navigate("/resend-confirmation", { state: { email } })}
            >
              Gửi lại email xác nhận
            </button>
          )}

          <Link to="/forgot" className="forgot">
            Quên mật khẩu
          </Link>
          <div className="divider"></div>
          <p>
            Bạn mới biết đến trang web? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
