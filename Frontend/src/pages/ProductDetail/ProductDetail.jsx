import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/books/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error("API không trả về JSON\n" + text);
        }
        return res.json();
      })
      .then((json) => {
        const b = json.data;
        if (b) {
          // ✅ Lưu thông tin sách
          setBook({
            id: b.id,
            title: b.nameBook,
            price: b.price,
            desc: b.describe,
            stock: b.number,
            author: b.author,
            categories: b.category.map((c) => c.name).join(", "),
            rating: b.averageRating,
          });

          // ✅ Lưu toàn bộ đánh giá (nếu có)
          if (Array.isArray(b.reviews)) {
            setReviews(
              b.reviews.map((r) => ({
                id: r.id,
                username: r.fullName || "Người dùng ẩn danh",
                rating: r.rating,
                comment: r.comment,
                createdAt: r.timestamp,
              }))
            );
          } else {
            setReviews([]);
          }
        }
      })
      .catch((err) => console.error("❌ Lỗi fetch:", err));
  }, [id]);

  // ✅ Format ngày giờ dd/MM/yyyy HH:mm:ss
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return "Không xác định";
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      pad(date.getDate()) +
      "/" +
      pad(date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds())
    );
  };

  if (!book) return <div className="loading">⏳ Đang tải thông tin sản phẩm...</div>;

  return (
    <div className="product-detail-page">
      <main className="product-main">
        <div className="product-image">
          <img
            src={`https://placehold.co/400x600?text=${book.title}`}
            alt={book.title}
          />
        </div>

        <div className="product-info">
          <h2 className="title">{book.title}</h2>
          <p className="author">
            <strong>Tác giả:</strong> {book.author || "Đang cập nhật"}
          </p>

          <p className="desc">{book.desc}</p>

          <div className="price">
            Giá:{" "}
            {book.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </div>

          <div className="stock">Tồn kho: {book.stock}</div>
          <div className="category">Thể loại: {book.categories}</div>
          <div className="rating">
            ⭐ {book.rating ? book.rating.toFixed(1) : "0.0"} / 5
          </div>

          <div className="cart-actions">
            <div className="quantity">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </button>
              <input type="text" value={quantity} readOnly />
              <button
                onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
              >
                +
              </button>
            </div>
            <button
              className="add-to-cart"
              onClick={() =>
                console.log("🛒 Thêm giỏ hàng:", book.id, quantity)
              }
            >
              Thêm giỏ hàng
            </button>
          </div>
        </div>
      </main>

      {/* 🧩 Danh sách đánh giá */}
      <section className="product-review">
        <h3>Đánh giá sản phẩm</h3>

        {reviews.length === 0 ? (
          <div className="review-box">
            ⭐ {book.rating || 0} / 5 - Chưa có đánh giá chi tiết
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-box">
              <div className="review-header">
                <strong>{r.username}</strong> — ⭐ {r.rating} / 5
              </div>
              <div className="review-comment">{r.comment}</div>
              <div className="review-date">{formatDateTime(r.createdAt)}</div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
