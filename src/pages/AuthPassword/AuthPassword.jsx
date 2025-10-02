import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import "./AuthPassword.css";
import logo from "../../assets/logo.png";

export default function AuthPassword() {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

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

  // Gửi OTP
  const handleSendOtp = async () => {
    if (!email) {
      setMessage("Vui lòng nhập email");
      return;
    }
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("📧 Send OTP response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Gửi OTP thất bại");
      }

      setMessage("✅ OTP đã được gửi, vui lòng kiểm tra email!");
    } catch (err) {
      console.error("❌ Send OTP error:", err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setMessage("Vui lòng nhập OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      console.log("🔐 Verify OTP response:", data);

      if (!res.ok) {
        throw new Error(data.message || "OTP không hợp lệ");
      }

      // Lấy reset token - thử nhiều format
      const tokenFromApi = 
        data.data?.reset_token || 
        data.data?.resetToken || 
        data.reset_token || 
        data.resetToken ||
        "";

      console.log("🎫 Reset token:", tokenFromApi);

      if (!tokenFromApi) {
        console.error("❌ Full response:", JSON.stringify(data, null, 2));
        throw new Error("Không tìm thấy reset token trong phản hồi API");
      }

      // Lưu reset token
      setResetToken(tokenFromApi);
      localStorage.setItem("reset_token", tokenFromApi);
      
      setStep(3);
      setMessage("✅ OTP hợp lệ, vui lòng nhập mật khẩu mới");
    } catch (err) {
      console.error("❌ Verify OTP error:", err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate password
    if (!password || !confirmPassword) {
      setMessage("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    if (password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      // Lấy reset token
      const token = resetToken || localStorage.getItem("reset_token");
      console.log("🎫 Reset token đang dùng:", token);

      if (!token) {
        throw new Error("Thiếu reset token, vui lòng thử lại từ đầu");
      }

      // Thử nhiều format payload khác nhau
      const payloads = [
        // Format 1: resetoken (theo code cũ)
        {
          resetoken: token,
          password,
          confirmPassword,
        },
        // Format 2: reset_token (snake_case)
        {
          reset_token: token,
          password,
          confirmPassword,
        },
        // Format 3: resetToken (camelCase)
        {
          resetToken: token,
          password,
          confirmPassword,
        },
        // Format 4: token field
        {
          token: token,
          password,
          confirmPassword,
        },
      ];

      let success = false;
      let lastError = null;

      // Thử từng format cho đến khi thành công
      for (const payload of payloads) {
        console.log("🔄 Đang thử payload:", payload);

        try {
          const res = await fetch(`${API_URL}/api/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await res.json();
          console.log("📩 Reset response:", data);

          if (res.ok) {
            success = true;
            setMessage("✅ Mật khẩu đã được thay đổi thành công!");
            localStorage.removeItem("reset_token");
            setTimeout(() => navigate("/login"), 1500);
            break;
          } else {
            lastError = data.message || "Đặt lại mật khẩu thất bại";
          }
        } catch (err) {
          lastError = err.message;
          continue;
        }
      }

      if (!success) {
        throw new Error(lastError || "Không thể đặt lại mật khẩu");
      }

    } catch (err) {
      console.error("❌ Reset password error:", err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear message khi chuyển step
  const handleStepChange = (newStep) => {
    setStep(newStep);
    setMessage("");
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
          <button className="back-login-btn" onClick={() => navigate("/login")}>
            ← Quay lại đăng nhập
          </button>

          {step === 1 && (
            <>
              <h2>QUÊN MẬT KHẨU</h2>
              <p className="subtitle">Nhập email để nhận mã OTP</p>
              
              <form className="email-otp-form" onSubmit={handleVerifyOtp}>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Nhập email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="otp-row">
                  <input
                    type="text"
                    placeholder="Nhập OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <button
                    type="button"
                    className="send-otp-btn"
                    onClick={handleSendOtp}
                    disabled={loading || !email}
                  >
                    {loading ? "Đang gửi..." : "Gửi OTP"}
                  </button>
                </div>

                <button type="submit" className="submit-btn" disabled={loading || !otp}>
                  Tiếp tục →
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2>ĐẶT LẠI MẬT KHẨU</h2>
              <p className="subtitle">Nhập mật khẩu mới của bạn</p>
              
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <div className="password-field">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu mới"
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
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </button>
              </form>
            </>
          )}

          {message && (
            <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}