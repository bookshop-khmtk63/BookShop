import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function RegisterConfirmation() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("⏳ Đang xác thực...");
  const [success, setSuccess] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const token = searchParams.get("token"); // Lấy token từ URL
    if (!token) {
      setMessage("❌ Token không tồn tại trong đường dẫn.");
      setSuccess(false);
      return;
    }

    const confirmRegistration = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/auth/registerConfirmation?token=${token}`,
          { method: "GET" }
        );

        const data = await res.json();

        if (res.ok) {
          setMessage("✅ Xác thực email thành công! Bạn có thể đăng nhập.");
          setSuccess(true);
        } else {
          setMessage(`❌ ${data.message || "Token không hợp lệ hoặc đã hết hạn."}`);
          setSuccess(false);
        }
      } catch (error) {
        setMessage("⚠️ Có lỗi xảy ra khi xác thực. Vui lòng thử lại.");
        setSuccess(false);
      }
    };

    confirmRegistration();
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{message}</h2>
      {success && (
        <p>
          👉 <Link to="/login">Đăng nhập ngay</Link>
        </p>
      )}
      {!success && (
        <p>
          🔁 <Link to="/register-success">Gửi lại email xác nhận</Link>
        </p>
      )}
    </div>
  );
}
