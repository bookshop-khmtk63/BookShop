import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AuthPassword.css";
import logo from "../../assets/logo.png";

export default function AuthPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Gửi OTP thất bại");
      }
      setStep(2);
      setMessage("OTP đã được gửi, vui lòng kiểm tra email!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "OTP không hợp lệ");
      }
      const data = await response.json();
      setResetToken(data.data?.resetToken || "");
      setStep(3);
      setMessage("OTP hợp lệ, vui lòng nhập mật khẩu mới");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/rest-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, resetToken }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Đặt lại mật khẩu thất bại");
      }
      setMessage("Mật khẩu đã được thay đổi thành công!");
      setStep(1);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setResetToken("");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleResendOtp = async () => {
    if (!email) {
      setMessage("Vui lòng nhập email trước khi gửi lại OTP");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Gửi lại OTP thất bại");
      setMessage("OTP mới đã được gửi, vui lòng kiểm tra email!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-section">
        <div className="logo-placeholder">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <div className="form-section">
        <div className="auth-box">
          {step === 1 && (
            <>
              <h2>QUÊN MẬT KHẨU</h2>
              <form onSubmit={handleSendOtp}>
                <input
                  type="email"
                  placeholder="Nhập email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi OTP"}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2>XÁC MINH OTP</h2>
              <form onSubmit={handleVerifyOtp}>
                <input
                  type="text"
                  placeholder="Nhập OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button type="button" className="resend-btn" onClick={handleResendOtp} disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi lại OTP"}
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang xác minh..." : "Xác minh OTP"}
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2>ĐẶT LẠI MẬT KHẨU</h2>
              <form onSubmit={handleResetPassword}>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu mới"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="eye" onClick={toggleShowPassword}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span className="eye" onClick={toggleShowConfirmPassword}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </button>
              </form>
            </>
          )}

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
