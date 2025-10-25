import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/Context";
import "./ProfileForm.css";

export default function ProfileForm() {
  const { callApiWithToken, setUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // ==========================
  // 📦 Lấy thông tin người dùng
  // ==========================
  const fetchUserData = async () => {
    try {
      const data = await callApiWithToken(`${API_URL}/api/auth/me`);
      if (data) {
        setUser(data);
        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } else {
        throw new Error("Không lấy được thông tin người dùng");
      }
    } catch (err) {
      console.error("❌ Fetch user error:", err);
      setErrors(["Không thể tải thông tin người dùng"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ==========================
  // ✏️ Xử lý input thay đổi
  // ==========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================
  // 💾 Gửi form cập nhật
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");

    const newErrors = [];
    const { fullName, email, phone, address } = form;

    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      newErrors.push("Không được để trống các trường bắt buộc");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.push("Email không hợp lệ");
    }

    const phoneRegex = /^\d{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      newErrors.push("Số điện thoại phải có 10 chữ số");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      const data = await callApiWithToken(
        `${API_URL}/api/customer/update-customer`,
        {
          method: "PATCH",
          data: form,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data) {
        setUser(data);
        setSuccess("✅ Cập nhật thông tin thành công!");
      }
    } catch (err) {
      console.error("❌ Update profile error:", err);
      setErrors(["Không thể cập nhật thông tin. Vui lòng thử lại!"]);
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // ⏳ Loading state
  // ==========================
  if (loading) return <p className="loading-text">⏳ Đang tải thông tin người dùng...</p>;

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2 className="form-title">Thông tin cá nhân</h2>

      {/* Họ tên */}
      <div className="form-group">
        <label>Họ và tên *</label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Nhập họ và tên"
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Nhập email"
        />
      </div>

      {/* Số điện thoại */}
      <div className="form-group">
        <label>Số điện thoại *</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Nhập số điện thoại"
        />
      </div>

      {/* Địa chỉ */}
      <div className="form-group">
        <label>Địa chỉ *</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Nhập địa chỉ"
        />
      </div>

      {/* Nút lưu */}
      <button type="submit" className="btn-save" disabled={saving}>
        {saving ? "💾 Đang lưu..." : "Lưu thay đổi"}
      </button>

      {/* Thông báo lỗi */}
      {errors.length > 0 && (
        <div className="error-box">
          {errors.map((err, idx) => (
            <p key={idx} className="error-text">❌ {err}</p>
          ))}
        </div>
      )}

      {/* Thông báo thành công */}
      {success && <p className="success-text">{success}</p>}
    </form>
  );
}
