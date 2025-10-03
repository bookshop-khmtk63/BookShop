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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(""); 

  const API_URL = import.meta.env.VITE_API_URL;

  // Lấy thông tin user
  const fetchUserData = async () => {
    try {
      const { res, data } = await callApiWithToken(`${API_URL}/api/customer/me`);
      if (res.ok && data?.data) {
        setUser(data.data);
        setForm({
          fullName: data.data.fullName || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
        });
      } else {
        throw new Error(data?.message || "Không lấy được thông tin user");
      }
    } catch (err) {
      console.error("❌ Fetch user error:", err);
      setError("Lỗi tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(""); 

    // ✅ Validate: tất cả trường phải có dữ liệu
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }

    try {
      const { res, data } = await callApiWithToken(
        `${API_URL}/api/customer/update-customer`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        setUser(data.data);
        setSuccess("✅ Cập nhật thông tin thành công!");
      } else {
        throw new Error(data?.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("❌ Update profile error:", err);
      setError("Lỗi khi cập nhật thông tin!");
    }
  };

  if (loading) return <p>⏳ Đang tải thông tin...</p>;
  if (error && !success) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2>Thông tin cá nhân</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="form-group">
        <label>Họ tên:</label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Số điện thoại:</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Địa chỉ:</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Cập nhật</button>
    </form>
  );
}
