import React from "react";
import { Link } from "react-router-dom";
import "./BookCard.css";

export default function BookCard({ id, title, author, price, image, rating }) {
  return (
    <div className="book-card">
      <Link to={`/book/${id}`} className="book-link">
        <div className="image">
          <img src={image} alt={title} />
        </div>
        <h5>{title}</h5>
        <div className="price">{price}</div>
        <div className="rating">⭐ {rating}</div>
      </Link>

      <button
        className="add-to-cart"
        onClick={(e) => {
          e.stopPropagation(); // tránh click vào link
          e.preventDefault();
          console.log("Thêm vào giỏ hàng:", id);
        }}
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
