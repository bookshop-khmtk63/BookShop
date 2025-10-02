import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/Context";
import "./ProfileForm.css";

export default function ProfileForm() {
  const { user, token, setUser, refreshToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // nội dung thông báo
  const [messageType, setMessageType] = useState("success"); // 'success' | 'error'

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const updateProfile = async (currentToken) => {
    const res = await fetch(`${API_URL}/api/customer/update-customer`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      throw { status: res.status, message: data.message || "Cập nhật thất bại" };
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!token) throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");

      try {
        await updateProfile(token);
      } catch (err) {
        if (err.status === 401 && refreshToken) {
          const newToken = await refreshToken();
          if (!newToken) throw new Error("Không lấy được token mới, vui lòng đăng nhập lại.");
          await updateProfile(newToken);
        } else {
          throw err;
        }
      }

      setMessage("Cập nhật thành công!");
      setMessageType("success");
      setUser({ ...user, ...form });
    } catch (err) {
      console.error("Update error:", err);
      setMessage(err.message || "Cập nhật thất bại!");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    fullName: "Họ và tên",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>Thông tin cá nhân</h2>

      {Object.entries(form).map(([key, value]) => (
        <div key={key} className="form-row">
          <label className="form-label">{labels[key]}</label>
          <div className="form-content">
            <input
              type="text"
              name={key}
              value={value}
              placeholder="Nhập dữ liệu..."
              onChange={handleChange}
            />
          </div>
        </div>
      ))}

      <input
        type="submit"
        className="save-btn"
        value={loading ? "Đang lưu..." : "Lưu thay đổi"}
        disabled={loading}
      />

      {message && (
        <p
          className="form-message"
          style={{ color: messageType === "success" ? "green" : "red" }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
