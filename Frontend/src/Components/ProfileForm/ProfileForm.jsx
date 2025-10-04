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
  const [success, setSuccess] = useState(""); 

  const API_URL = import.meta.env.VITE_API_URL;

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
      setErrors(["Lỗi tải thông tin người dùng"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors([]);
  
    const newErrors = [];
    const emptyFields = [];
  
    if (!form.fullName.trim()) emptyFields.push("Họ tên không được để trống");
    if (!form.email.trim()) emptyFields.push("Email không được để trống");
    if (!form.phone.trim()) emptyFields.push("Số điện thoại không được để trống");
    if (!form.address.trim()) emptyFields.push("Địa chỉ không được để trống");
  
    // 👉 Nếu có từ 2 ô trống trở lên -> chỉ báo chung
    if (emptyFields.length >= 2) {
      setErrors(["Không được để trống"]);
      return;
    }
  
    // 👉 Nếu chỉ có 1 ô trống -> báo riêng
    if (emptyFields.length === 1) {
      setErrors(emptyFields);
      return;
    }
  
    // ✅ Validate email format (chỉ check khi có email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.push("Email không hợp lệ");
    }
  
    // ✅ Validate phone (chỉ check khi có phone)
    if (!/^\d{10}$/.test(form.phone)) {
      newErrors.push("Số điện thoại không hợp lệ!");
    }
  
    if (newErrors.length > 0) {
      setErrors(newErrors);
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
        setSuccess("Cập nhật thành công!");
      } else {
        throw new Error(data?.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("❌ Update profile error:", err);
      setErrors(["Lỗi khi cập nhật thông tin!"]);
    }
  };
  
  
  if (loading) return <p>⏳ Đang tải thông tin...</p>;

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2>Thông tin cá nhân</h2>

      <div className="form-group">
        <label>Họ tên:</label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <form noValidate> <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        /></form>
       
      </div>

      <div className="form-group">
        <label>Số điện thoại:</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Địa chỉ:</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Lưu thay đổi</button>

      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((err, idx) => (
            <p key={idx} className="error-message">{err}</p>
          ))}
        </div>
      )}

      {success && <p className="success-message">{success}</p>}
    </form>
  );
}
