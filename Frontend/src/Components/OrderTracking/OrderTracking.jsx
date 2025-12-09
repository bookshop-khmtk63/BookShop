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
  const pageSize = 3;

  const [totalPages, setTotalPages] = useState(1);

  // --- GIỮ NGUYÊN CHUẨN HÓA DỮ LIỆU ---
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

  // --- FETCH API ---
  const fetchOrders = async (pageNumber) => {
    setLoading(true);
    setError("");

    try {
      const res = await callApiWithToken(
        `${API_URL}/api/customer/tracking-order?page=${pageNumber}&size=${pageSize}`
      );

      console.log("📦 API Response:", res);

      const meta = res;
      
      
      // tổng trang backend trả luôn chính xác
      setTotalPages(meta.totalPages);

      // gửi đúng format normalize yêu cầu
      const data = normalizeOrdersResponse({
        data: { data: meta.data }
      });
      setOrders(data);
    } catch (err) {
      console.error("❌ Lỗi:", err);
      setError("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // --- PHÂN TRANG GIỐNG Y BOOKLIST ---
  const getPageNumbers = (current, total, delta = 1) => {
    const pages = [];
    const range = [];

    for (let i = 0; i < total; i++) {
      if (
        i === 0 ||
        i === total - 1 ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    let last = -1;
    for (let i of range) {
      if (i - last > 1) pages.push("dots");
      pages.push(i);
      last = i;
    }
    return pages;
  };

  if (loading) return <p>⏳ Đang tải đơn hàng...</p>;
  if (error) return <p>{error}</p>;
  if (!orders || orders.length === 0)
    return <p className="no-orders">Không có đơn hàng nào.</p>;

  return (
    <div className="order-tracking-page fade-in">
      <h2 className="page-title">Theo dõi đơn hàng</h2>

      {orders.map((order) => (
        <div key={order.idOrder} className="order-block fade-slide">
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

          <div className="order-table">
            <div className="order-header-row">
              <div>Ảnh</div>
              <div>Tên sách</div>
              <div>Giá</div>
              <div>Số lượng</div>
            </div>

            {order.items?.map((item) => (
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

          <div className="order-total">
            <strong>Tổng tiền:</strong>{" "}
            {Number(order.totalPrice).toLocaleString("vi-VN")} ₫
          </div>
        </div>
      ))}

      {/* --- PHÂN TRANG BOOKLIST --- */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            &lt;
          </button>

          {getPageNumbers(page, totalPages).map((p, i) =>
            p === "dots" ? (
              <span key={i} className="dots">…</span>
            ) : (
              <button
                key={i}
                className={page === p ? "active" : ""}
                onClick={() => setPage(p)}
              >
                {p + 1}
              </button>
            )
          )}

          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
