import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/Context";
import "./OrderTracking.css";

export default function OrderTracking() {
  const { callApiWithToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 3; // hiển thị 3 đơn mỗi trang

  // ✅ Giữ nguyên phần chuẩn hóa dữ liệu
  const normalizeOrdersResponse = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;

    const d1 = res?.data;
    if (Array.isArray(d1)) return d1;

    const d2 = d1?.data;
    if (Array.isArray(d2)) return d2;

    const d3 = d2?.data;
    if (Array.isArray(d3)) return d3;

    if (d1 && d1.data && Array.isArray(d1.data)) return d1.data;
    if (res?.data && res.data.data && Array.isArray(res.data.data))
      return res.data.data;

    return [];
  };

  // ✅ Lấy toàn bộ đơn hàng từ backend (tất cả các trang)
  const fetchAllOrders = async () => {
    setLoading(true);
    setError("");
    try {
      // 1️⃣ Gọi trang đầu để biết tổng số trang
      const firstRes = await callApiWithToken(
        `${API_URL}/api/customer/tracking-order?page=0&size=${pageSize}`
      );

      console.log("📦 Trang đầu tiên:", firstRes);
      const meta = firstRes?.data?.data;
      const totalPages = meta?.totalPages || 1;

      // Lấy dữ liệu trang đầu tiên qua hàm chuẩn hóa
      let allOrders = normalizeOrdersResponse(firstRes);

      // 2️⃣ Gọi các trang tiếp theo (nếu có)
      for (let i = 1; i < totalPages; i++) {
        const nextRes = await callApiWithToken(
          `${API_URL}/api/customer/tracking-order?page=${i}&size=${pageSize}`
        );
        const nextOrders = normalizeOrdersResponse(nextRes);
        allOrders = [...allOrders, ...nextOrders];
      }

      console.log("✅ Tất cả đơn hàng:", allOrders);
      setOrders(allOrders);
    } catch (err) {
      console.error("❌ Lỗi khi tải đơn hàng:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // ✅ Phân trang client-side
  const totalPagesClient = Math.ceil(orders.length / pageSize);
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPagesClient - 1) setPage(page + 1);
  };

  // 🧭 Giao diện hiển thị
  if (loading) return <p className="loading">⏳ Đang tải danh sách đơn hàng...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orders || orders.length === 0)
    return <p className="no-orders">Bạn chưa có đơn hàng nào.</p>;

  return (
    <div className="order-tracking-page fade-in">
      <h2 className="page-title">Theo dõi đơn hàng</h2>

      {currentOrders.map((order) => (
        <div key={order.idOrder} className="order-block fade-slide">
          {/* --- Header đơn hàng --- */}
          <div className="order-header">
            <h3 className="order-id">📦 Mã đơn hàng: {order.idOrder}</h3>
            <span
              className={`order-status ${
                order.status === "DANG_GIAO"
                  ? "shipping"
                  : order.status === "HOAN_THANH"
                  ? "completed"
                  : "pending"
              }`}
            >
              {order.status === "DANG_GIAO"
                ? "Đang giao"
                : order.status === "HOAN_THANH"
                ? "Hoàn thành"
                : "Đang xử lý"}
            </span>
          </div>

          {/* --- Danh sách sản phẩm --- */}
          <div className="order-table">
            <div className="order-header-row">
              <div>Ảnh</div>
              <div>Tên sách</div>
              <div>Giá tiền</div>
              <div>Số lượng</div>
            </div>

            {(order.items ?? []).map((item) => (
              <div key={item.bookId} className="order-row">
                <div className="order-image">
                  <img src={item.thumbnail} alt={item.bookName} />
                </div>
                <div className="order-name">{item.bookName}</div>
                <div className="order-price">
                  {Number(item.unitPrice).toLocaleString("vi-VN")} ₫
                </div>
                <div className="order-quantity">{item.quantity}</div>
              </div>
            ))}
          </div>

          {/* --- Tổng tiền --- */}
          <div className="order-total">
            <strong>Tổng tiền:</strong>{" "}
            {Number(order.totalPrice).toLocaleString("vi-VN")} ₫
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
          Trang {page + 1} / {totalPagesClient}
        </span>

        <button
          onClick={handleNextPage}
          className={`btn-page ${page >= totalPagesClient - 1 ? "inactive" : ""}`}
        >
          Trang sau ➡
        </button>
      </div>
    </div>
  );
}
