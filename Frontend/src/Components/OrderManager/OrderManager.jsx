import React, { useEffect, useState } from "react";
import "./OrderManager.css";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // ✅ Modal hiển thị đơn đang chọn

  // 🧭 Dữ liệu mẫu
  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          code: "abcd1234",
          name: "Đơn hàng sách A",
          status: "DONE",
          items: [
            { id: 1, bookName: "Dế Mèn Phiêu Lưu Ký", quantity: 2, price: 75000 },
            { id: 2, bookName: "Harry Potter", quantity: 1, price: 120000 },
          ],
          total: 270000,
          address: "123 Đường ABC, TP. HCM",
          customer: "Nguyễn Văn A",
        },
        {
          id: 2,
          code: "xyz7890",
          name: "Đơn hàng sách B",
          status: "PENDING",
          items: [
            { id: 3, bookName: "Lão Hạc", quantity: 1, price: 45000 },
            { id: 4, bookName: "Tắt Đèn", quantity: 3, price: 60000 },
          ],
          total: 225000,
          address: "456 Trần Hưng Đạo, Hà Nội",
          customer: "Trần Thị B",
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  // ✅ Cập nhật trạng thái (demo)
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // ✅ Mở modal
  const openModal = (order) => {
    setSelectedOrder(order);
  };

  // ✅ Đóng modal
  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (loading) return <p className="loading">⏳ Đang tải đơn hàng...</p>;

  return (
    <div className="order-manager">
      <h2 className="page-title">📦 Quản lý đơn hàng</h2>

      <div className="table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đơn hàng</th>
              <th>Tên đơn hàng</th>
              <th>Chi tiết đơn hàng</th>
              <th>Trạng thái đơn hàng</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  😕 Chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.code}</td>
                  <td>{order.name}</td>
                  <td>
                    <button
                      className="detail-btn"
                      onClick={() => openModal(order)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`status-select ${order.status.toLowerCase()}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHIPPING">Shipping</option>
                      <option value="DONE">Done</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🪟 Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Ngăn tắt khi click bên trong
          >
            <h3>📋 Chi tiết đơn hàng</h3>
            <p><strong>Mã đơn hàng:</strong> {selectedOrder.code}</p>
            <p><strong>Khách hàng:</strong> {selectedOrder.customer}</p>
            <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.address}</p>

            <table className="modal-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, i) => (
                  <tr key={item.id}>
                    <td>{i + 1}</td>
                    <td>{item.bookName}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {item.price.toLocaleString("vi-VN")} ₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-total">
              <strong>Tổng tiền:</strong>{" "}
              {selectedOrder.total.toLocaleString("vi-VN")} ₫
            </div>

            <div className="modal-actions">
              <button onClick={closeModal} className="close-btn">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
