import React from "react";
import "./BookCard.css";

import sach from'../Assets/sach.png'

export default function BookCard({ title, price }) {
  return (
    <div className="book-card">
      <div className="image">
        <img src={sach}/>
      </div>
      <h5>{title}</h5>
      <div className="price">{price}</div>
      <button className="add-to-cart">Thêm vào giỏ hàng</button>
    </div>
  );
}
