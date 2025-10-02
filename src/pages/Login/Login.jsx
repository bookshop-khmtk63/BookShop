import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Nếu API trả về code 2003 (không tìm thấy tài khoản)
        if (res.status === 404 && data.code === 2003) {
          setError("Sai tên tài khoản hoặc mật khẩu");
        } else {
          setError(data.message || "Đăng nhập thất bại!");
        }
        return;
      }

      // API trả về { data: { accessToken, email, role } }
      const { accessToken, email: userEmail, role } = data.data;

      // Lưu token và user vào context + localStorage
      login(accessToken, { email: userEmail, role });

      // Điều hướng về trang chủ
      navigate("/");
    } catch (err) {
      console.error("Lỗi fetch:", err);
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
