import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookCard from "../BookCard/BookCard"; // import component mới
import "./SearchPage.css";

export default function SearchPage() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const navigate = useNavigate();

  const pageSize = 6; // số sách mỗi trang
  const API_URL = import.meta.env.VITE_API_URL;
  
  // Reset page khi keyword thay đổi
  useEffect(() => {
    setPage(1);
  }, [keyword]);

  // Fetch sách mỗi khi page hoặc keyword thay đổi
  useEffect(() => {
    fetchBooks(page);
  }, [keyword, page]);

  // Fetch và map dữ liệu API
  const fetchBooks = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/books/search-es?keyword=${encodeURIComponent(
          keyword
        )}&page=${pageNumber - 1}&size=${pageSize}`
      );
      const json = await res.json();
      const rawBooks = json.data?.data || [];

      const mappedBooks = rawBooks.map((b) => ({
        id: b.id,
        title: b.nameBook,
        price: Number(b.price) || 0,
        rating: Number(b.averageRating) || 0,
        image: b.thumbnail || "https://via.placeholder.com/150",
        category: b.category?.map((c) => c.name).join(", ") || "Khác",
        describe: b.describe || "",
        number: b.number || 0,
      }));

      setBooks(mappedBooks);
      setTotalPages(json.data?.totalPages || 0);
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setBooks([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Pagination kiểu gọn
  const getPageNumbers = (currentPage, totalPages, delta = 1) => {
    const pages = [];
    const range = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let lastPage = 0;
    for (let i of range) {
      if (i - lastPage > 1) pages.push("dots");
      pages.push(i);
      lastPage = i;
    }

    return pages;
  };

  return (
    <div className="search-page">
      <h2>Kết quả tìm kiếm: "{keyword}"</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : books.length === 0 ? (
        <p>Không tìm thấy sách nào.</p>
      ) : (
        <div className="search-grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            price={book.price}
            image={book.image}
            rating={book.rating}
          />
        ))}
      </div>
      
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
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
                {p}
              </button>
            )
          )}

          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
