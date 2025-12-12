import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import "./OrderHistory.css";

export default function OrderHistory() {
  const navigate = useNavigate();
  const { callApiWithToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]); // toàn bộ dữ liệu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0); // trang hiện tại
  const pageSize = 3; // số đơn mỗi trang

  // ✅ Lấy dữ liệu lịch sử đơn hàng
  const fetchOrderHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await callApiWithToken(`${API_URL}/api/customer/history-order`);
      console.log("📦 API Response:", res);

      const data = res?.data?.data || res?.data || res;
      if (Array.isArray(data)) setOrders(data);
      else setOrders([]);
    } catch (err) {
      console.error("❌ Lỗi khi tải lịch sử đơn hàng:", err);
      setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // ✅ Tính toán danh sách đơn hàng hiển thị theo trang
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const currentOrders = orders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(orders.length / pageSize);

  // ✅ Chuyển trang (vòng lặp)
  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  // ✅ Điều hướng sang trang đánh giá
  const handleReview = (item) => {
    navigate(`/review/${item.bookId}`, { state: { product: item } });
  };

  // 🧭 Trạng thái hiển thị
  if (loading) return <p className="loading">⏳ Đang tải lịch sử đơn hàng...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orders || orders.length === 0)
    return <p className="no-orders">Bạn chưa có đơn hàng nào.</p>;

  // ✅ Giao diện chính
  return (
    <div className="order-history-page fade-in">
      <h2 className="page-title">Lịch sử đơn hàng</h2>

      {currentOrders.map((order) => (
        <div key={order.idOrder} className="order-card fade-slide">
          {/* --- Thông tin đơn hàng --- */}
          <div className="order-header">
            <h3>📦 Mã đơn hàng: {order.idOrder}</h3>
            <span
              className={`order-status ${
                order.status === "HOAN_THANH"
                  ? "completed"
                  : order.status === "DANG_GIAO"
                  ? "shipping"
                  : "pending"
              }`}
            >
              {order.status === "HOAN_THANH"
                ? "Hoàn thành"
                : order.status === "DANG_GIAO"
                ? "Đang giao"
                : "Đang xử lý"}
            </span>
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

            {(order.items ?? []).map((item) => (
              <div className="table-row" key={item.orderDetailId}>
                <div className="col-image">
                  <img src={item.thumbnail} alt={item.bookName} />
                </div>
                <div className="col-name">{item.bookName}</div>
                <div className="col-price">
                  {Number(item.unitPrice ?? 0).toLocaleString("vi-VN")} ₫
                </div>
                <div className="col-quantity">{item.quantity}</div>
                <div className="col-actions">
                  <button className="btn-rebuy">Mua lại</button>
                </div>
                <div className="col-review">
                  {item.review ? (
                    <button
                      className="btn-review disabled"
                      disabled
                      title="Bạn đã đánh giá sản phẩm này"
                    >
                      Đã đánh giá
                    </button>
                  ) : (
                    <button
                      className="btn-review"
                      onClick={() => handleReview(item)}
                      title="Đánh giá sản phẩm"
                    >
                      Đánh giá
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* --- Tổng tiền --- */}
          <div className="order-total">
            <strong>Tổng tiền:</strong>{" "}
            {Number(order.totalPrice ?? 0).toLocaleString("vi-VN")} ₫
          </div>
        </div>
      ))}

      {/* --- Phân trang --- */}
      <div className="pagination">
        <button
          onClick={handlePrevPage}
          className={`btn-page ${page === 0 ? "inactive" : ""}`}
        >
          ⬅ Trang trước
        </button>

        <span className="page-info">
          Trang {page + 1} / {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          className={`btn-page ${page >= totalPages - 1 ? "inactive" : ""}`}
        >
          Trang sau ➡
        </button>
      </div>
    </div>
  );
}
