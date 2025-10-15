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
  const [page, setPage] = useState(0); // ✅ Trang hiện tại
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Chuẩn hóa dữ liệu API về mảng đơn hàng
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

  // ✅ Lấy dữ liệu lịch sử đơn hàng
  useEffect(() => {
    let cancelled = false;

    const fetchOrderHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await callApiWithToken(
          `${API_URL}/api/customer/history-order?pageNumber=${page}&pageSize=3`
        );

        console.log("🔥 Full API Response:", res);

        const rawData =
          res?.data?.data ||
          res?.data ||
          res; // Lấy phần chứa thông tin phân trang
        const ordersData = normalizeOrdersResponse(res);

        console.log("✅ Parsed ordersData:", ordersData);

        if (!cancelled) {
          setOrders(Array.isArray(ordersData) ? [...ordersData] : []);
          setTotalPages(rawData?.totalPages || 1);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải lịch sử đơn hàng:", err);
        if (!cancelled)
          setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrderHistory();

    return () => {
      cancelled = true;
    };
  }, [API_URL, callApiWithToken, page]);

  // Log sau khi setState (do async)
  useEffect(() => {
    console.log("🟢 orders state updated:", orders);
  }, [orders]);

  // ✅ Điều hướng đến trang đánh giá
  const handleReview = (item) => {
    navigate(`/review/${item.bookId}`, { state: { product: item } });
  };

  // ✅ Chuyển trang
  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  // 🧭 Hiển thị trạng thái
  if (loading) return <p className="loading">⏳ Đang tải lịch sử đơn hàng...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orders || orders.length === 0)
    return <p className="no-orders">😕 Bạn chưa có đơn hàng nào.</p>;

  return (
    <div className="order-history-page">
      <h2 className="page-title">Lịch sử đơn hàng</h2>

      {orders.map((order) => (
        <div
          key={order.idOrder ?? order.id ?? JSON.stringify(order)}
          className="order-card"
        >
          {/* --- Thông tin đơn hàng --- */}
          <div className="order-header">
            <h3>📦 Mã đơn hàng: {order.idOrder ?? order.id}</h3>

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
                : order.status ?? "Đang xử lý"}
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

            {(order.items ?? []).length > 0 ? (
              order.items.map((item) => (
                <div
                  className="table-row"
                  key={item.bookId ?? item.orderDetailId ?? JSON.stringify(item)}
                >
                  <div className="col-image">
                    <img src={item.thumbnail} alt={item.bookName} />
                  </div>
                  <div className="col-name">{item.bookName}</div>
                  <div className="col-price">
                    {Number(item.unitPrice ?? item.linePrice ?? 0).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    ₫
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
              ))
            ) : (
              <div className="table-row no-items">
                <p>Không có sản phẩm trong đơn hàng này.</p>
              </div>
            )}
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
          disabled={page === 0}
          className="btn-page"
        >
          ⬅ Trang trước
        </button>

        <span className="page-info">
          Trang {page + 1} / {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={page >= totalPages - 1}
          className="btn-page"
        >
          Trang sau ➡
        </button>
      </div>
    </div>
  );
}
