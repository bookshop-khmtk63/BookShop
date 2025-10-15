import React, { useState } from "react";
import "./OrderTracking.css";

export default function OrderTracking() {
  const [orders] = useState([
    {
      id: "DH001",
      status: "Đang giao",
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
      status: "Hoàn thành",
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

  return (
    <div className="order-tracking-page">
      <h2 className="page-title">Theo dõi đơn hàng</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-block">
          {/* Header đơn hàng */}
          <div className="order-header">
            <h3 className="order-id">Mã đơn hàng: {order.id}</h3>
            <span
              className={`order-status ${
                order.status.toLowerCase().includes("giao")
                  ? "shipping"
                  : "completed"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Bảng sản phẩm */}
          <div className="order-table">
            <div className="order-header-row">
              <div>Ảnh</div>
              <div>Tên sách</div>
              <div>Giá Tiền</div>
              <div>Số lượng</div>
            </div>

            {order.items.map((item) => (
              <div key={item.id} className="order-row">
                <div className="order-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="order-name">{item.name}</div>
                <div className="order-price">
                  {item.price.toLocaleString("vi-VN")} ₫
                </div>
                <div className="order-quantity">{item.quantity}</div>
              </div>
            ))}
          </div>

          {/* Tổng tiền */}
          <div className="order-total">
            <strong>Tổng tiền: </strong>
            {order.total.toLocaleString("vi-VN")} ₫
          </div>
        </div>
      ))}
    </div>
  );
}
