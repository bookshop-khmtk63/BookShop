// src/Components/AdminLayout/AdminSidebar.jsx
import React, { useState } from "react";  // ✅ thêm { useState }
import "./AdminLayout.css";
import logo from "../../assets/logo.png";

export default function AdminSidebar({ onMenuSelect }) {
  const [activeMenu, setActiveMenu] = useState("Thêm sách");

  const menuItems = [
    "Thêm sách",
    "Sửa thông tin sách",
    "Xóa sách",
    "Thống kê",
    "Quản lý đơn hàng",
    "Quản lý đánh giá",
    "Quản lý người dùng",
  ];

  const handleClick = (item) => {
    setActiveMenu(item);
    onMenuSelect(item); // báo cho AdminApp biết menu nào được chọn
  };

  return (
    <div className="admin-sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <p className="menu-title">MENU</p>
      {menuItems.map((item) => (
        <button
          key={item}
          className={`menu-btn ${activeMenu === item ? "active" : ""}`}
          onClick={() => handleClick(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
