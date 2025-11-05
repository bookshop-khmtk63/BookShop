import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/Context"; // ⚠️ Đảm bảo đúng đường dẫn
import "./OrderManager.css";

export default function OrderManager() {
  const { callApiWithToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  // ✅ Lấy danh sách đơn hàng
  const fetchOrders = async (page = 0) => {
    setLoading(true);
    setError("");
    try {
      const res = await callApiWithToken(
        `/api/admin/all-order?page=${page}&size=${pageSize}`
      );

      if (res?.data) {
        setOrders(res.data);
        setTotalPages(res.totalPages || 1);
      } else {
        throw new Error("Dữ liệu trả về không đúng định dạng!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách đơn hàng:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  // ✅ Mở / Đóng modal chi tiết
  const openModal = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  // ✅ Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await callApiWithToken(`/api/admin/${orderId}/status`, {
        method: "PATCH",
        data: { newStatus: newStatus },
      });

      // ✅ Nếu cập nhật thành công thì update UI
      setOrders((prev) =>
        prev.map((order) =>
          order.idOrder === orderId ? { ...order, status: newStatus } : order
        )
      );

      console.log(`✅ Cập nhật đơn #${orderId} thành công: ${newStatus}`);
    } catch (error) {
      console.error("❌ Lỗi khi đổi trạng thái đơn hàng:", error);
    }
  };

  if (loading) return <p className="loading">⏳ Đang tải đơn hàng...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="order-manager">
      <h2 className="page-title">📦 Quản lý đơn hàng</h2>

      <div className="table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đơn hàng</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Chi tiết</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  😕 Chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.idOrder}>
                  <td>{currentPage * pageSize + index + 1}</td>
                  <td>#{order.idOrder}</td>
                  <td>{order.address}</td>
                  <td>{order.totalPrice.toLocaleString("vi-VN")} ₫</td>
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
                        handleStatusChange(order.idOrder, e.target.value)
                      }
                      disabled={order.status === "HOAN_THANH"}
                      className={`status-select ${order.status.toLowerCase()}`}
                    >
                      {order.status === "CHO_XU_LY" && (
                        <>
                          <option value="CHO_XU_LY">CHO_XU_LY</option>
                          <option value="DANG_GIAO">DANG_GIAO</option>
                        </>
                      )}

                      {order.status === "DANG_GIAO" && (
                        <>
                          <option value="DANG_GIAO">DANG_GIAO</option>
                          <option value="HOAN_THANH">HOAN_THANH</option>
                        </>
                      )}

                      {order.status === "HOAN_THANH" && (
                        <option value="HOAN_THANH">HOAN_THANH</option>
                      )}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>📋 Chi tiết đơn hàng</h3>
            <p>
              <strong>Mã đơn hàng:</strong> #{selectedOrder.idOrder}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              {selectedOrder.totalPrice.toLocaleString("vi-VN")} ₫
            </p>

            <table className="modal-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ảnh</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, i) => (
                  <tr key={item.orderDetailId}>
                    <td>{i + 1}</td>
                    <td>
                      <img
                        src={item.thumbnail}
                        alt={item.bookName}
                        className="book-thumb"
                      />
                    </td>
                    <td>{item.bookName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice.toLocaleString("vi-VN")} ₫</td>
                    <td>{item.linePrice.toLocaleString("vi-VN")} ₫</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-actions">
              <button onClick={closeModal} className="close-btn">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Phân trang --- */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          ❮
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-number ${currentPage === i ? "active" : ""}`}
            onClick={() => setCurrentPage(i)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="page-btn"
          onClick={() =>
            setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
          }
          disabled={currentPage + 1 === totalPages}
        >
          ❯
        </button>
      </div>
    </div>
  );
}
