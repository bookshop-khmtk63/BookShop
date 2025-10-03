import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams(); // lấy id từ URL
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
          setBook({
            id: b.id,
            title: b.nameBook,
            price: b.price,
            desc: b.describe,
            stock: b.number,
            categories: b.category.map((c) => c.name).join(", "),
            rating: b.averageRating,
          });

          // Nếu API trả về reviews
          if (b.reviews && Array.isArray(b.reviews)) {
            setReviews(
              b.reviews.map((r) => ({
                id: r.id,
                username: r.user?.name || "Người dùng ẩn danh",
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt,
              }))
            );
          }
        }
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [id]);

  if (!book) return <div>Đang tải...</div>;

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

          <div className="cart-actions">
            <div className="quantity">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </button>
              <input type="text" value={quantity} readOnly />
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(book.stock, q + 1))
                }
              >
                +
              </button>
            </div>
            <button
              className="add-to-cart"
              onClick={() =>
                console.log("Thêm giỏ hàng:", book.id, quantity)
              }
            >
              Thêm giỏ hàng
            </button>
          </div>
        </div>
      </main>

      <section className="product-review">
        <h3>Đánh giá sản phẩm</h3>
        {reviews.length === 0 ? (
          <div className="review-box">⭐ {book.rating} / 5 - Chưa có đánh giá chi tiết</div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-box">
              <div>
                <strong>{r.username}</strong> - ⭐ {r.rating} / 5
              </div>
              <div>{r.comment}</div>
              <div className="review-date">
                {new Date(r.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
