import React, { useEffect, useState } from "react";
import "../../BookTable/BookTable.css";

export default function BookUpdateTable({ onUpdate }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const booksPerPage = 10;

  const API_URL = import.meta.env.VITE_API_URL; // ✅ Dùng file .env

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/books/all?page=0&size=1000`);
        const data = await res.json();

        if (data?.data?.data) {
          setBooks(data.data.data);
        } else {
          throw new Error("Không có dữ liệu sách.");
        }
      } catch (err) {
        console.error("❌ Lỗi tải danh sách sách:", err);
        setError("Không thể tải danh sách sách. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [API_URL]);

  const filteredBooks = books.filter(
    (book) =>
      book.nameBook?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(book.id).includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirst, indexOfLast);

  const renderPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (start > 1) pages.push(<span key="start-ellipsis">...</span>);
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    if (end < totalPages) pages.push(<span key="end-ellipsis">...</span>);

    return pages;
  };

  if (loading) return <p className="loading">⏳ Đang tải danh sách sách...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="book-table-container">
      <h2 className="table-title">Danh sách sách cần cập nhật</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên hoặc ID sách..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
      </div>

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
              <td colSpan="4">Không có sách nào phù hợp.</td>
            </tr>
          ) : (
            currentBooks.map((book, index) => (
              <tr key={book.id}>
                <td>{indexOfFirst + index + 1}</td>
                <td>{book.id}</td>
                <td>{book.nameBook}</td>
                <td>
                  <button
                    className="update-btn"
                    onClick={() => onUpdate(book.id)}
                  >
                    ✏️ Cập nhật
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            Trang đầu
          </button>

          <button
            className="page-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>

          {renderPageNumbers()}

          <button
            className="page-btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>

          <button
            className="page-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Trang cuối
          </button>
        </div>
      )}
    </div>
  );
}
