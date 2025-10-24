import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import AddToCartPopup from "../../Components/AddToCartPopup/AddToCartPopup";
import "./BookCard.css";

export default function BookCard({ id, title, author, price, image, rating, number }) {
  const { token, callApiWithToken, updateCartCount } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const [popup, setPopup] = useState(null);

  // 🛒 Thêm vào giỏ hàng
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!token) {
      setPopup({
        message: "⚠️ Vui lòng đăng nhập để thêm sản phẩm!",
        type: "warn",
      });
      return;
    }

    if (number <= 0) {
      setPopup({
        message: "❌ Sản phẩm này đã hết hàng!",
        type: "error",
      });
      return;
    }

    try {
      await callApiWithToken(`${API_URL}/api/customer/cart-add/${id}`, {
        method: "POST",
        data: { quantity: 1 },
      });

      await updateCartCount();
      setPopup({
        message: "✅ Sản phẩm đã được thêm vào Giỏ hàng!",
        type: "success",
      });
    } catch (error) {
      console.error("❌ Lỗi API:", error);
      setPopup({
        message: "❌ Không thể thêm sản phẩm!",
        type: "error",
      });
    }
  };

  return (
    <>
      {popup && (
        <AddToCartPopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}

      {/* ✅ Khi hết hàng: thêm class out-of-stock */}
      <div className={`book-card ${number <= 0 ? "out-of-stock" : ""}`}>
        <Link to={`/book/${id}`} className="book-link">
          <div className="image">
            <img src={image} alt={title} />

            {/* ✅ Lớp phủ “HẾT HÀNG” */}
            {number <= 0 && (
              <div className="overlay">
                <span>HẾT HÀNG</span>
              </div>
            )}
          </div>

          <h5>{title}</h5>
          <p className="author">{author}</p>
          <div className="price">
            {price?.toLocaleString("vi-VN")} ₫
          </div>
          <div className="rating">⭐ {rating}</div>
        </Link>

        <button
          className={`add-to-cart ${number <= 0 ? "disabled" : ""}`}
          onClick={handleAddToCart}
          disabled={number <= 0}
        >
          {number <= 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
        </button>
      </div>
    </>
  );
}
