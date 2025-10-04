import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookCard from "../BookCard/BookCard";
import "./SearchResults.css";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 6;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (keyword.trim() === "") {
      // nếu không có từ khóa, có thể redirect hoặc hiển thị tất cả
      // navigate("/")  // nếu muốn về trang chính
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);
      try {
        const resp = await fetch(
          `${API_URL}/api/books/search-es?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
        );
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        const json = await resp.json();
        const pageData = json.data;
        // pageData.data là mảng BookResponse DTOs
        setBooks(pageData.data || []);
        setTotalPages(pageData.totalPages);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [keyword, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <main className="search-results">
      <h2>Kết quả tìm kiếm cho: "{keyword}"</h2>

      {loading && <p>Đang tải...</p>}

      <div className="grid">
        {books.length > 0
          ? books.map((b) => <BookCard key={b.id} {...b} />)
          : !loading && <p>Không tìm thấy sách nào phù hợp.</p>}
      </div>

      <div className="pagination">
        <button
          disabled={page === 0}
          onClick={() => handlePageChange(page - 1)}
        >
          &lt; Trước
        </button>
        <span>
          Trang {page + 1} / {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Tiếp &gt;
        </button>
      </div>
    </main>
  );
}
