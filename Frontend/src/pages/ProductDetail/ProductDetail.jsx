import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { callApiWithToken,token,isLoggedIn } = useAuth();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState(null); // 👈 dùng thay popup
  const API_URL = import.meta.env.VITE_API_URL;

  // 🧩 Lấy thông tin sách
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
            author: b.author,
            categories: b.category.map((c) => c.name).join(", "),
            rating: b.averageRating,
          });

          setReviews(
            Array.isArray(b.reviews)
              ? b.reviews.map((r) => ({
                  id: r.id,
                  username: r.fullName || "Người dùng ẩn danh",
                  rating: r.rating,
                  comment: r.comment,
                  createdAt: r.timestamp,
                }))
              : []
          );
        }
      })
      .catch((err) => console.error("❌ Lỗi fetch:", err));
  }, [id, API_URL]);

  // ✅ Format ngày giờ dd/MM/yyyy HH:mm:ss
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return "Không xác định";
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  // ✅ Hiển thị thông báo nhỏ
  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2000);
  };

  // 🛒 Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
    
    if (!book) return;
    if (!isLoggedIn || !token) {
      showMessage("⚠️ Vui lòng đăng nhập để thêm sản phẩm!", "warn");
      return;
    }
    if (book.stock <= 0) {
      showMessage("⚠️ Sản phẩm đã hết hàng!", "error");
      return;
    }

    if (quantity > book.stock) {
      showMessage("⚠️ Số lượng vượt quá tồn kho!", "error");
      return;
    }

    try {
      await callApiWithToken(`${API_URL}/api/customer/cart-add/${book.id}`, {
        method: "POST",
        data: { quantity },
      });
      showMessage("✅ Đã thêm vào giỏ hàng!", "success");
    } catch (err) {
      console.error("❌ Lỗi thêm giỏ hàng:", err);
      showMessage("❌ Không thể thêm sản phẩm!", "error");
    }
  };

  // ✅ Giới hạn số lượng và hiện cảnh báo
  const handleQuantityChange = (value) => {
    if (!book) return;
    const num = Number(value);

    if (isNaN(num)) return;

    if (num < 1) {
      showMessage("⚠️ Số lượng tối thiểu là 1!", "warn");
      setQuantity(1);
      return;
    }

    if (num > book.stock) {
      showMessage("⚠️ Đã đạt số lượng tối đa trong kho!", "warn");
      setQuantity(book.stock);
      return;
    }

    setQuantity(num);
  };

  if (!book)
    return <div className="loading">⏳ Đang tải thông tin sản phẩm...</div>;

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

          <div className="stock">
            {book.stock > 0 ? (
              <>Tồn kho: {book.stock}</>
            ) : (
              <span style={{ color: "red", fontWeight: "bold" }}>Hết hàng</span>
            )}
          </div>

          <div className="category">Thể loại: {book.categories}</div>
          <div className="rating">
            ⭐ {book.rating ? book.rating.toFixed(1) : "0.0"} / 5
          </div>

          {/* --- Chức năng giỏ hàng --- */}
          <div className="cart-actions">
            <div className="quantity">
              <button
                onClick={() => {
                  if (quantity <= 1) {
                    showMessage("⚠️ Số lượng tối thiểu là 1!", "warn");
                  } else {
                    setQuantity((q) => q - 1);
                  }
                }}
                disabled={book.stock <= 0}
              >
                -
              </button>

              <input
                type="number"
                min="1"
                max={book.stock}
                value={quantity}
                disabled={book.stock <= 0}
                onChange={(e) => handleQuantityChange(e.target.value)}
              />

              <button
                onClick={() => {
                  if (quantity >= book.stock) {
                    showMessage("⚠️ Đã đạt số lượng tối đa trong kho!", "warn");
                  } else {
                    setQuantity((q) => q + 1);
                  }
                }}
                disabled={book.stock <= 0}
              >
                +
              </button>
            </div>

            <button
              className="add-to-cart"
              onClick={handleAddToCart}
              disabled={book.stock <= 0}
            >
              {book.stock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
            </button>
          </div>

          {/* 🔔 Thông báo hiển thị ngay dưới nút */}
          {message && (
            <div className={`inline-message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      </main>

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
