import React, { useState } from "react";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import logo from "../Assets/logo.png";
import "./Header.css";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

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

      <div className="icons">
        <FaShoppingCart className="cart-icon" />
        {isLoggedIn ? (
          <div className="user-menu-wrapper">
            <FaUser
              className="user-icon"
              onClick={() => setShowMenu((prev) => !prev)}
            />
            {showMenu && (
              <div className="user-menu">
                <Link to="/profile" onClick={()=>setShowMenu(false)}>Thông tin cá nhân</Link>
                <Link to="/orders" onClick={()=>setShowMenu(false)} >Đơn hàng</Link>
                <Link to="/order-history" onClick={()=>setShowMenu(false)}>Lịch sử đơn hàng</Link>
                <button onClick={logout}>Đăng xuất</button>
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
