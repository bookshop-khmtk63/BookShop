import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams(); // lấy id từ URL
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch("/books.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((b) => String(b.id) === id);
        setBook(found);
      });
  }, [id]);

  if (!book) return <div>Không tìm thấy sách hoặc đang tải...</div>;

  return (
    <div className="product-detail-page">
      <main className="product-main">
        <div className="product-image">
          <img src={book.image} alt={book.title} />
        </div>

        <div className="product-info">
          <h2 className="title">{book.title}</h2>
          <p className="desc">{book.desc}</p>
          <div className="price">
            Giá: {book.price.toLocaleString("vi-VN")}đ
          </div>
          <div className="stock">Tồn kho: {book.stock}</div>

          <div className="cart-actions">
            <div className="quantity">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </button>
              <input type="text" value={quantity} readOnly />
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
            <button
              className="add-to-cart"
              onClick={() => console.log("Thêm giỏ hàng:", book.id, quantity)}
            >
              Thêm giỏ hàng
            </button>
          </div>
        </div>
      </main>

      <section className="product-review">
        <h3>Đánh giá sản phẩm</h3>
        <div className="review-box">Chưa có đánh giá nào</div>
      </section>
    </div>
  );
}
