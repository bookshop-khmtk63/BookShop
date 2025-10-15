import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Dùng để điều hướng
import "./OrderHistory.css";

export default function OrderHistory() {
  const navigate = useNavigate(); // ✅ Hook điều hướng

  const [orders] = useState([
    {
      id: "DH001",
      total: 345000,
      items: [
        {
          id: 1,
          name: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
          price: 115000,
          quantity: 2,
          image:
            "https://cdn0.fahasa.com/media/catalog/product/t/u/tuoi-tre-dang-gia-bao-nhieu-tai-ban-2022.jpg",
        },
        {
          id: 2,
          name: "Đắc Nhân Tâm",
          price: 115000,
          quantity: 1,
          image:
            "https://cdn0.fahasa.com/media/catalog/product/d/a/dac-nhan-tam-bia-cung.jpg",
        },
      ],
    },
    {
      id: "DH002",
      total: 180000,
      items: [
        {
          id: 3,
          name: "Harry Potter và Hòn Đá Phù Thủy",
          price: 180000,
          quantity: 1,
          image:
            "https://cdn0.fahasa.com/media/catalog/product/h/a/harry-potter-va-hon-da-phu-thuy.jpg",
        },
      ],
    },
  ]);

  // ✅ Khi nhấn "Đánh giá", chuyển hướng đến trang ReviewProduct
  const handleReview = (item) => {
    navigate(`/review/${item.id}`, { state: { product: item } });
  };

  return (
    <div className="order-history-page">
      <h2 className="page-title">Lịch sử đơn hàng</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          {/* --- Mã đơn hàng --- */}
          <div className="order-header">
            <h3>📦 Mã đơn hàng: {order.id}</h3>
          </div>

          {/* --- Bảng sản phẩm --- */}
          <div className="order-table">
            <div className="table-header">
              <div className="col-image">Ảnh</div>
              <div className="col-name">Tên sách</div>
              <div className="col-price">Giá tiền</div>
              <div className="col-quantity">Số lượng</div>
              <div className="col-actions">Mua lại</div>
              <div className="col-review">Đánh giá</div>
            </div>

            {order.items.map((item) => (
              <div className="table-row" key={item.id}>
                <div className="col-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="col-name">{item.name}</div>
                <div className="col-price">
                  {item.price.toLocaleString("vi-VN")} ₫
                </div>
                <div className="col-quantity">{item.quantity}</div>
                <div className="col-actions">
                  <button className="btn-rebuy">Mua lại</button>
                </div>
                <div className="col-review">
                  <button
                    className="btn-review"
                    onClick={() => handleReview(item)}
                  >
                    Đánh giá
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- Tổng tiền --- */}
          <div className="order-total">
            <strong>Tổng tiền:</strong>{" "}
            {order.total.toLocaleString("vi-VN")} ₫
          </div>
        </div>
      ))}
    </div>
  );
}
