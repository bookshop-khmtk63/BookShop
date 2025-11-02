import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/Context"; // ⚠️ sửa đúng đường dẫn
import "./ReviewManager.css";

export default function ReviewManager() {
  const { callApiWithToken } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // ✅ thông báo trạng thái
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  // ✅ Lấy danh sách đánh giá
  const fetchReviews = async (page = 0) => {
    setLoading(true);
    setError("");
    try {
      const res = await callApiWithToken(
        `/api/admin/review-all?page=${page}&size=${pageSize}`
      );

      if (res?.data) {
        setReviews(res.data);
        setTotalPages(res.totalPages || 1);
      } else {
        throw new Error("Dữ liệu trả về không đúng định dạng!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách đánh giá:", err);
      setError("Không thể tải danh sách đánh giá. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  // ✅ Xóa đánh giá qua API thật + hiển thị thông báo
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) return;

    try {
      await callApiWithToken(`/api/admin/review/${id}`, { method: "DELETE" });

      setReviews((prev) => prev.filter((r) => r.id !== id));
      setMessage("✅ Xóa đánh giá thành công!");

      // Ẩn thông báo sau 3 giây
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Lỗi khi xóa đánh giá:", error);
      setMessage("❌ Xóa đánh giá thất bại. Vui lòng thử lại.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading)
    return <p className="loading">⏳ Đang tải danh sách đánh giá...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="review-manager">
      <h2 className="page-title">📝 Quản lý đánh giá</h2>

      {/* ✅ Thông báo */}
      {message && <div className="message">{message}</div>}

      <div className="table-wrapper">
        <table className="review-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Người dùng</th>
              <th>Nội dung</th>
              <th>Số sao</th>
              <th>Thời gian</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  😕 Chưa có đánh giá nào.
                </td>
              </tr>
            ) : (
              reviews.map((r, index) => (
                <tr key={r.id}>
                  <td>{currentPage * pageSize + index + 1}</td>
                  <td>{r.fullName}</td>
                  <td className="content-cell">{r.comment}</td>
                  <td>
                    <span className="stars">
                      {"⭐".repeat(Math.round(r.rating))}
                    </span>
                  </td>
                  <td>{new Date(r.timestamp).toLocaleString("vi-VN")}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(r.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
