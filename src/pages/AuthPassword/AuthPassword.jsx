import React, { useState, useMemo } from "react";
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

  // ✅ Hàm kiểm tra các rule của mật khẩu
  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@#$%^&+=!]/.test(password),
      noSpace: !/\s/.test(password),
    };
  }, [password]);

  // Gửi OTP
  const handleSendOtp = async () => {
    if (!email.trim()) {
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
      if (!res.ok) throw new Error(data.message || "Gửi OTP thất bại");
      setMessage("✅ OTP đã được gửi đến email của bạn!");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim()) {
      setMessage("Vui lòng nhập đầy đủ email và OTP");
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
      if (!res.ok) throw new Error(data.message || "OTP không hợp lệ");

      const tokenFromApi = data.data?.reset_token;
      if (!tokenFromApi) throw new Error("Không nhận được reset token từ server");

      setResetToken(tokenFromApi);
      localStorage.setItem("reset_token", tokenFromApi);
      setStep(2);
      setMessage("");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!password.trim() || !confirmPassword.trim()) {
      setMessage("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("❌ Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    // Check rule: tất cả đều phải true
    if (!Object.values(passwordChecks).every(Boolean)) {
      setMessage("❌ Mật khẩu chưa đáp ứng đủ yêu cầu bảo mật");
      return;
    }

    setLoading(true);

    try {
      const tokenToUse = resetToken || localStorage.getItem("reset_token");
      if (!tokenToUse) throw new Error("Không tìm thấy reset token. Vui lòng thử lại từ đầu.");

      const res = await fetch(`${API_URL}/api/auth/rest-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken: tokenToUse, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đặt lại mật khẩu thất bại");

      setMessage("✅ Đặt lại mật khẩu thành công!");
      localStorage.removeItem("reset_token");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
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
          <button className="back-login-btn" onClick={() => navigate("/login")}>
            ← Quay lại đăng nhập
          </button>

          {/* Bước 1 */}
          {step === 1 && (
            <>
              <h2>QUÊN MẬT KHẨU</h2>
              <form className="email-otp-form" onSubmit={handleVerifyOtp}>
                <input
                  type="email"
                  placeholder="Nhập email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="otp-row">
                  <input
                    type="text"
                    placeholder="Nhập OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <button type="button" className="send-otp-btn" onClick={handleSendOtp} disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi OTP"}
                  </button>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang xác thực..." : "Xác thực OTP"}
                </button>
              </form>
            </>
          )}

          {/* Bước 2 */}
          {step === 2 && (
            <>
              <h2>ĐẶT LẠI MẬT KHẨU</h2>
              <form onSubmit={handleResetPassword}>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="eye" onClick={() => setShowPassword(!showPassword)}>
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
                  <span className="eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </button>
              </form>

              {/* ✅ danh sách rule */}
              <ul className="password-rules">
                <li className={passwordChecks.length ? "valid" : "invalid"}>Ít nhất 8 ký tự</li>
                <li className={passwordChecks.lowercase ? "valid" : "invalid"}>Có chữ thường (a-z)</li>
                <li className={passwordChecks.uppercase ? "valid" : "invalid"}>Có chữ hoa (A-Z)</li>
                <li className={passwordChecks.number ? "valid" : "invalid"}>Có chữ số (0-9)</li>
                <li className={passwordChecks.special ? "valid" : "invalid"}>Có ký tự đặc biệt (@#$%^&+=!)</li>
                <li className={passwordChecks.noSpace ? "valid" : "invalid"}>Không chứa khoảng trắng</li>
              </ul>
            </>
          )}

          {message && <p className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
