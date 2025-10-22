import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import logo from "../Assets/logo.png";
import "./Header.css";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Ẩn menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* 🔍 Thanh tìm kiếm */}
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tìm kiếm sách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>

      {/* 🧩 Icon người dùng + giỏ hàng */}
      <div className="icons">
        {/* 🛒 Giỏ hàng — chuyển hướng khi click */}
        <FaShoppingCart
          className="cart-icon"
          onClick={() => navigate("/cart")}
          title="Xem giỏ hàng"
        />

        {isLoggedIn ? (
          <div className="user-menu-wrapper" ref={menuRef}>
            <FaUser
              className="user-icon"
              onClick={() => setShowMenu((prev) => !prev)}
              title="Tài khoản"
            />
            {showMenu && (
              <div className="user-menu">
                <Link to="/profile" onClick={() => setShowMenu(false)}>
                  Thông tin cá nhân
                </Link>
                <Link to="/orders" onClick={() => setShowMenu(false)}>
                  Theo dõi đơn hàng
                </Link>
                <Link to="/order-history" onClick={() => setShowMenu(false)}>
                  Lịch sử đơn hàng
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-btn">
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
