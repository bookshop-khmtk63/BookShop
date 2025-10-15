import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReviewProduct.css";

export default function ReviewProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  // Dòng mô tả tương ứng cho mỗi mức sao
  const ratingLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"];

  if (!product) {
    return (
      <div className="review-page">
        <p>⚠️ Không tìm thấy sản phẩm để đánh giá.</p>
        <button onClick={() => navigate("/order-history")}>⬅️ Quay lại</button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Vui lòng chọn số sao để đánh giá!");
      return;
    }

    alert(
      `Bạn đã đánh giá ${rating} sao (${ratingLabels[rating - 1]}) cho ${product.name}!\nBình luận: ${comment}`
    );
    navigate("/order-history");
  };

  return (
    <div className="review-page">
      <h2 className="page-title">Đánh Giá Sản Phẩm</h2>

      <div className="product-box">
        <img src={product.image} alt={product.name} className="product-img" />
        <div className="product-info">
          <h3>{product.name}</h3>
          <p>Giá: {product.price.toLocaleString("vi-VN")} ₫</p>
        </div>
      </div>

      {/* Phần chọn sao giống Shopee */}
      <div className="rating-section">
        <span className="rating-title">Chất lượng sản phẩm:</span>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${
                (hovered || rating) >= star ? "active" : ""
              }`}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <span className="rating-label">
          {hovered || rating
            ? ratingLabels[(hovered || rating) - 1]
            : "Chưa có đánh giá"}
        </span>
      </div>

      {/* Form bình luận */}
      <form className="review-form" onSubmit={handleSubmit}>
        <label htmlFor="comment">Nội dung đánh giá:</label>
        <textarea
          id="comment"
          placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="button-group">
          <button
            type="button"
            className="btn-back"
            onClick={() => navigate("/order-history")}
          >
            Trở lại
          </button>
          <button type="submit" className="btn-submit">
            Hoàn thành
          </button>
        </div>
      </form>
    </div>
  );
}
