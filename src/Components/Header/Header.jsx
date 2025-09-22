import React, { useState } from "react";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import "./Header.css";

import logo from "../Assets/logo.png";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Ở đây bạn có thể mở modal hoặc gọi API login
    setIsLoggedIn(true);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm" />
        <button>
          <FaSearch />
        </button>
      </div>

      <div className="icons">
        <FaShoppingCart />
        {isLoggedIn ? (
          <FaUser />
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
