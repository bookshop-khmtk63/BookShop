import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import "./ReviewProduct.css";

export default function ReviewProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { callApiWithToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const product = location.state?.product;

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // ✅ success / error

  const ratingLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"];

  if (!product) {
    return (
      <div className="review-page">
        <p>Không tìm thấy sản phẩm để đánh giá.</p>
        <button onClick={() => navigate("/order-history")}>⬅️ Quay lại</button>
      </div>
    );
  }

  // ✅ Gửi đánh giá lên server
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setMessageType("error");
      setMessage("⚠️ Vui lòng chọn số sao để đánh giá!");
      return;
    }

    const reviewData = { rating, comment };

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const response = await callApiWithToken(
        `${API_URL}/api/customer/create-review/${product.bookId}`,
        {
          method: "POST",
          data: reviewData,
        }
      );

      console.log("📤 API Response:", response);

      if (response?.code === 200 && response?.message === "success") {
        setMessageType("success");
        setMessage(`Bạn đã đánh giá thành công!`);
        setTimeout(() => navigate("/order-history"), 2000);
      } else {
        throw new Error(response?.message || "Gửi đánh giá thất bại!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi gửi đánh giá:", err);
      const status = err.response?.status;

      if (status === 401) {
        setMessageType("error");
        setMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (status === 409) {
        setMessageType("error");
        setMessage("Bạn đã đánh giá sản phẩm này rồi.");
        setTimeout(() => navigate("/order-history"), 2000);
      } else {
        setMessageType("error");
        setMessage("Gửi đánh giá thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-page">
      <h2 className="page-title">Đánh Giá Sản Phẩm</h2>

      {/* 🧩 Thông tin sản phẩm */}
      <div className="product-box">
        <img
          src={product.thumbnail || product.image}
          alt={product.bookName || product.name}
          className="product-img"
        />
        <div className="product-info">
          <h3>{product.bookName || product.name}</h3>
          <p>
            Giá:{" "}
            {Number(product.unitPrice || product.price).toLocaleString("vi-VN")} ₫
          </p>
        </div>
      </div>

      {/* ⭐ Phần chọn sao */}
      <div className="rating-section">
        <span className="rating-title">Chất lượng sản phẩm:</span>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${(hovered || rating) >= star ? "active" : ""}`}
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

      {/* 💬 Bình luận */}
      <form className="review-form" onSubmit={handleSubmit}>
        <label htmlFor="comment">Nội dung đánh giá:</label>
        <textarea
          id="comment"
          placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <div className="button-group">
          <button
            type="button"
            className="btn-back"
            onClick={() => navigate("/order-history")}
          >
            Trở lại
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Hoàn thành"}
          </button>
        </div>
      </form>

      {/* ✅ Thông báo trong khung */}
      {message && (
        <div className={`message-box ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
}
