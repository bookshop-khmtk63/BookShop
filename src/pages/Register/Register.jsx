import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";
import logo from "../../assets/logo.png";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorEmail, setErrorEmail] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");

  // show/hide mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ kiểm tra điều kiện password
  const passwordChecks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@#$%^&+=!]/.test(password),
    noSpace: !/\s/.test(password),
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorEmail("");
    setErrorGeneral("");

    if (password !== confirmPassword) {
      setErrorGeneral("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.validationErrors?.email) {
          setErrorEmail(data.validationErrors.email); // hiện trong ô email
        } else {
          setErrorGeneral(data.message || "Đăng ký thất bại!");
        }
        return;
      }

      navigate("/register-success");
    } catch (err) {
      setErrorGeneral("Không thể kết nối tới server!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Logo */}
      <div className="logo-section">
        <div className="logo-placeholder">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      {/* Form đăng ký */}
      <div className="form-section">
        <div className="register-box">
          <h2>ĐĂNG KÝ</h2>
          <form onSubmit={handleRegister}>
            {/* Email */}
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorEmail && <p className="error-text">{errorEmail}</p>}
            </div>

            {/* Mật khẩu */}
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Hiển thị điều kiện mật khẩu */}
            

            {/* Nhập lại mật khẩu */}
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="eye"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <ul className="password-rules">
              <li className={passwordChecks.length ? "valid" : "invalid"}>
                {passwordChecks.length ? "✔" : "✖"} Ít nhất 8 ký tự
              </li>
              <li className={passwordChecks.lowercase ? "valid" : "invalid"}>
                {passwordChecks.lowercase ? "✔" : "✖"} Có chữ thường (a-z)
              </li>
              <li className={passwordChecks.uppercase ? "valid" : "invalid"}>
                {passwordChecks.uppercase ? "✔" : "✖"} Có chữ hoa (A-Z)
              </li>
              <li className={passwordChecks.number ? "valid" : "invalid"}>
                {passwordChecks.number ? "✔" : "✖"} Có chữ số (0-9)
              </li>
              <li className={passwordChecks.special ? "valid" : "invalid"}>
                {passwordChecks.special ? "✔" : "✖"} Có ký tự đặc biệt (@#$%^&+=!)
              </li>
              <li className={passwordChecks.noSpace ? "valid" : "invalid"}>
                {passwordChecks.noSpace ? "✔" : "✖"} Không chứa khoảng trắng
              </li>
            </ul>

            {/* Lỗi chung */}
            {errorGeneral && <p className="error-text">{errorGeneral}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "ĐĂNG KÝ"}
            </button>
          </form>

          <div className="divider">
            <span>Hoặc</span>
          </div>

          <p>
            Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
