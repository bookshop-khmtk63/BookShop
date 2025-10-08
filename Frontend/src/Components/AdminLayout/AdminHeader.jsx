import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "./AdminLayout.css";

export default function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie =
      "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };

  return (
    <div className="admin-header">
      <div className="admin-icons" ref={menuRef}>
        <FaUserCircle
          className="user-icon"
          onClick={() => setMenuOpen((prev) => !prev)}
        />

        {menuOpen && (
          <div className="dropdown-menu">
            <p className="menu-title">Xin chào, Admin</p>
            <hr />
            <button className="menu-item logout" onClick={handleLogout}>
              <FaSignOutAlt /> Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
