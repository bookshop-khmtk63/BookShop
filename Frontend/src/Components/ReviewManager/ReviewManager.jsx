import React, { useState, useEffect } from "react";
import "./ReviewManager.css";

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🧩 Dữ liệu mẫu (thay bằng API sau)
  const mockData = [
    {
      id: 1,
      user: "Nguyễn Tuấn",
      book: "Đắc Nhân Tâm",
      content: "Sách rất hay, dễ hiểu và thực tế.",
      stars: 5,
      time: "2025-10-18 08:45",
    },
    {
      id: 2,
      user: "Lê Minh",
      book: "Tôi tài giỏi, bạn cũng thế!",
      content: "Khá ổn nhưng hơi dài.",
      stars: 4,
      time: "2025-10-19 14:10",
    },
    {
      id: 3,
      user: "Trần Hương",
      book: "Nhà Giả Kim",
      content: "Truyền cảm hứng và sâu sắc.",
      stars: 5,
      time: "2025-10-20 20:30",
    },
  ];

  useEffect(() => {
    // Giả lập tải dữ liệu từ server
    setTimeout(() => {
      setReviews(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  if (loading) return <p className="loading">⏳ Đang tải danh sách đánh giá...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="review-manager">
      <h2 className="page-title">📝 Quản lý đánh giá</h2>

      <div className="table-wrapper">
        <table className="review-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>User</th>
              <th>Tên sách</th>
              <th>Nội dung</th>
              <th>Số sao</th>
              <th>Thời gian</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  😕 Chưa có đánh giá nào.
                </td>
              </tr>
            ) : (
              reviews.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td>{r.user}</td>
                  <td>{r.book}</td>
                  <td className="content-cell">{r.content}</td>
                  <td>
                    <span className="stars">
                      {"⭐".repeat(r.stars)}
                    </span>
                  </td>
                  <td>{r.time}</td>
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
    </div>
  );
}
