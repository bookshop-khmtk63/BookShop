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
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Hàm chuẩn hóa dữ liệu trả về từ API
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

  // 🧩 Gọi API theo dõi đơn hàng
  const fetchOrders = async (pageNum = 0) => {
    setLoading(true);
    setError("");

    try {
      const res = await callApiWithToken(
        `${API_URL}/api/customer/tracking-order?page=${pageNum}&size=3`
      );

      console.log("📦 Full API Response:", res);

      // ✅ Chuẩn hóa dữ liệu để luôn trả về mảng
      const normalizedOrders = normalizeOrdersResponse(res);
      console.log("✅ Parsed orders:", normalizedOrders);

      setOrders(normalizedOrders);
      setTotalPages(res?.data?.data?.totalPages || 1);
    } catch (err) {
      console.error("❌ Lỗi khi tải đơn hàng:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Gọi API khi load / đổi trang
  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  if (loading) return <p className="loading">⏳ Đang tải danh sách đơn hàng...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orders || orders.length === 0)
    return <p className="no-orders">😕 Bạn chưa có đơn hàng nào đang giao.</p>;

  return (
    <div className="order-tracking-page">
      <h2 className="page-title">Theo dõi đơn hàng</h2>

      {orders.map((order) => (
        <div key={order.idOrder} className="order-block">
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

            {order.items.map((item) => (
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
            <strong>Tổng tiền: </strong>
            {Number(order.totalPrice).toLocaleString("vi-VN")} ₫
          </div>
        </div>
      ))}

      {/* --- Phân trang --- */}
      <div className="pagination">
        <button
          className="btn-page"
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        >
          ⬅ Trang trước
        </button>

        <span className="page-info">
          Trang <b>{page + 1}</b> / {totalPages}
        </span>

        <button
          className="btn-page"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
        >
          Trang sau ➡
        </button>
      </div>
    </div>
  );
}
