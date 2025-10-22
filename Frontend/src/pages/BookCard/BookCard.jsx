import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import AddToCartPopup from "../../Components/AddToCartPopup/AddToCartPopup";
import "./BookCard.css";

export default function BookCard({ id, title, author, price, image, rating }) {
  const { token, callApiWithToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const [popup, setPopup] = useState(null); // { message, type }

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

    try {
      await callApiWithToken(`${API_URL}/api/customer/cart-add/${id}`, {
        method: "POST",
        data: { quantity: 1 },
      });

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

      <div className="book-card">
        <Link to={`/book/${id}`} className="book-link">
          <div className="image">
            <img src={image} alt={title} />
          </div>
          <h5>{title}</h5>
          <div className="price">{price}₫</div>
          <div className="rating">⭐ {rating}</div>
        </Link>

        <button className="add-to-cart" onClick={handleAddToCart}>
          Thêm vào giỏ hàng
        </button>
      </div>
    </>
  );
}
