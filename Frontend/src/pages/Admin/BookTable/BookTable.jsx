import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/Context";
import "./BookTable.css";

export default function BookTable() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const { callApiWithToken } = useAuth();

  const booksPerPage = 10;
  const API_URL = import.meta.env.VITE_API_URL; // ✅ Dùng biến môi trường

  // 🧩 Lấy danh sách sách
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/books/all?page=0&size=1000`);
        const data = await res.json();
        setBooks(data?.data?.data || []);
      } catch (error) {
        console.error("❌ Lỗi tải danh sách sách:", error);
        setMessage("Không thể tải danh sách sách!");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [API_URL]);

  // 🗑 Xóa sách thật từ API admin
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sách này không?")) return;

    try {
      await callApiWithToken(`${API_URL}/api/admin/delete-book/${id}`, {
        method: "DELETE",
      });

      setBooks((prev) => prev.filter((book) => book.id !== id));
      setMessage("✅ Xóa sách thành công!");
      setMessageType("success");
    } catch (err) {
      console.error("❌ Lỗi khi xóa sách:", err);
      setMessage("❌ Lỗi xác thực hoặc token đã hết hạn!");
      setMessageType("error");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) return <p className="loading">⏳ Đang tải danh sách...</p>;

  // 🔍 Lọc sách theo tên
  const filteredBooks = books.filter((book) =>
    book.nameBook?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = currentPage * booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  // 🔢 Hiển thị số phân trang rút gọn
  const getDisplayedPages = () => {
    const pages = [];
    const maxVisible = 3;
    const start = Math.max(0, currentPage - maxVisible);
    const end = Math.min(totalPages - 1, currentPage + maxVisible);

    if (start > 0) pages.push(0);
    if (start > 1) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 2) pages.push("...");
    if (end < totalPages - 1) pages.push(totalPages - 1);

    return pages;
  };

  return (
    <div className="book-table-container">
      <h2 className="table-title">Các sách đang bán</h2>

      {/* 🔍 Thanh tìm kiếm */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên sách..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>

      {/* 💬 Thông báo */}
      {message && (
        <div className={`message-box ${messageType}`}>{message}</div>
      )}

      {/* 📚 Bảng hiển thị */}
      <table className="book-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.length === 0 ? (
            <tr>
              <td colSpan="4">Không có sách nào.</td>
            </tr>
          ) : (
            currentBooks.map((book, index) => (
              <tr key={book.id}>
                <td>{index + 1 + currentPage * booksPerPage}</td>
                <td>{book.id}</td>
                <td>{book.nameBook}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(book.id)}
                  >
                    🗑 Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
            disabled={currentPage === 0}
          >
            &lt;
          </button>

          {getDisplayedPages().map((item, i) =>
            item === "..." ? (
              <span key={i} className="dots">...</span>
            ) : (
              <button
                key={i}
                className={currentPage === item ? "active" : ""}
                onClick={() => setCurrentPage(item)}
              >
                {item + 1}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
