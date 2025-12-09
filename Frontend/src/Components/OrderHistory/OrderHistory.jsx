import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Context";
import "./OrderHistory.css";

export default function OrderHistory() {
  const navigate = useNavigate();
  const { callApiWithToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 3;

  const [totalPages, setTotalPages] = useState(1);

  // ⭐ GIỮ NGUYÊN CHUẨN HÓA Y NHƯ ORDERTRACKING
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

  // ⭐ FETCH PHÂN TRANG BACKEND
  const fetchOrderHistory = async (pageNumber) => {
    setLoading(true);
    setError("");

    try {
      const res = await callApiWithToken(
        `${API_URL}/api/customer/history-order?page=${pageNumber}&size=${pageSize}`
      );

      console.log("📦 API:", res);

      // backend trả dạng: { code, message, data: { totalPages, data: [] } }
      const meta = res;

      setTotalPages(meta.totalPages);

      // ⭐ TRUYỀN ĐÚNG FORMAT CHO normalize
      const normalized = normalizeOrdersResponse({
        data: { data: meta.data },
      });

      setOrders(normalized);
    } catch (err) {
      console.error("❌ Lỗi:", err);
      setError("Không thể tải lịch sử đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory(page);
  }, [page]);

  // ⭐ HÀM TẠO PHÂN TRANG DẠNG SỐ (y như BookList)
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
    for (let p of range) {
      if (p - last > 1) pages.push("dots");
      pages.push(p);
      last = p;
    }

    return pages;
  };

  const handleReview = (item) => {
    navigate(`/review/${item.bookId}`, { state: { product: item } });
  };

  // ⭐ Loading & Error
  if (loading) return <p>⏳ Đang tải lịch sử đơn hàng...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orders || orders.length === 0)
    return <p className="no-orders">Bạn chưa có đơn hàng nào.</p>;

  // ⭐ UI CHÍNH
  return (
    <div className="order-history-page fade-in">
      <h2 className="page-title">Lịch sử đơn hàng</h2>

      {orders.map((order) => (
        <div key={order.idOrder} className="order-card fade-slide">
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

          <div className="order-table">
            <div className="table-header">
              <div>Ảnh</div>
              <div>Tên sách</div>
              <div>Giá tiền</div>
              <div>Số lượng</div>
              <div>Mua lại</div>
              <div>Đánh giá</div>
            </div>

            {(order.items ?? []).map((item) => (
              <div className="table-row" key={item.orderDetailId}>
                <div className="col-image">
                  <img src={item.thumbnail} alt={item.bookName} />
                </div>

                <div className="col-name">{item.bookName}</div>
                <div className="col-price">
                  {Number(item.unitPrice).toLocaleString("vi-VN")} ₫
                </div>
                <div className="col-quantity">{item.quantity}</div>

                <div className="col-actions">
                  <button className="btn-rebuy">Mua lại</button>
                </div>

                <div className="col-review">
                  {item.review ? (
                    <button className="btn-review disabled" disabled>
                      Đã đánh giá
                    </button>
                  ) : (
                    <button
                      className="btn-review"
                      onClick={() => handleReview(item)}
                    >
                      Đánh giá
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <strong>Tổng tiền: </strong>
            {Number(order.totalPrice).toLocaleString("vi-VN")} ₫
          </div>
        </div>
      ))}

      {/* ⭐ PHÂN TRANG DẠNG SỐ */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            &lt;
          </button>

          {getPageNumbers(page, totalPages).map((p, idx) =>
            p === "dots" ? (
              <span key={idx} className="dots">…</span>
            ) : (
              <button
                key={idx}
                className={page === p ? "active" : ""}
                onClick={() => setPage(p)}
              >
                {p + 1}
              </button>
            )
          )}

          <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
