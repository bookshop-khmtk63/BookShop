import React, { useState, useEffect } from "react";
import BookCard from "../BookCard/BookCard";
import "./BookList.css";

export default function BookList({ filters }) {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 6; // mỗi trang 6 cuốn
  const API_URL = import.meta.env.VITE_API_URL;

  const parsePrice = (p) => {
    if (typeof p === "number") return p;
    if (typeof p === "string") return Number(p.replace(/[^\d]/g, "")) || 0;
    return 0;
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/books/all?page=0&size=1000`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const rawBooks = json.data?.data || [];
        const mapped = rawBooks.map((b) => ({
          id: b.id,
          title: b.nameBook,
          author: "Không rõ",
          price: b.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
          image: b.thumbnail,
          rating: b.averageRating || 0,
          status: b.status?.toLowerCase() || "available",
          category: b.category || "Khác",
        }));
        setBooks(mapped);
      })
      .catch(() =>
        setError("Không thể tải dữ liệu sách, vui lòng thử lại sau.")
      )
      .finally(() => setLoading(false));
  }, [API_URL]);

  // Lọc sách theo filters
  const filteredBooks = books.filter((book) => {
    if (
      filters.search &&
      !book.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.category && book.category !== filters.category) return false;
    if (filters.price === "under100" && parsePrice(book.price) >= 100000)
      return false;
    if (
      filters.price === "100-500" &&
      (parsePrice(book.price) < 100000 || parsePrice(book.price) > 500000)
    )
      return false;
    if (filters.status && book.status !== filters.status) return false;
    if (filters.rating && book.rating < Number(filters.rating)) return false;

    return true;
  });

  // Sắp xếp sách theo giá
  const sortedBooks = [...filteredBooks].sort((a, b) =>
    sortOrder === "asc"
      ? parsePrice(a.price) - parsePrice(b.price)
      : parsePrice(b.price) - parsePrice(a.price)
  );

  // Phân trang frontend
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Helper tạo mảng pagination gọn
  const getPageNumbers = (currentPage, totalPages, delta = 1) => {
    const pages = [];
    const range = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // luôn hiển thị trang đầu
        i === totalPages || // luôn hiển thị trang cuối
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let lastPage = 0;
    for (let i of range) {
      if (i - lastPage > 1) {
        pages.push("dots"); // thêm … nếu gián đoạn
      }
      pages.push(i);
      lastPage = i;
    }

    return pages;
  };

  return (
    <main className="book-list">
      <div className="sort">
        <label>Sắp xếp: </label>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="asc">Giá thấp → cao</option>
          <option value="desc">Giá cao → thấp</option>
        </select>
      </div>

      {loading && <p>Đang tải sách...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="grid">
        {!loading &&
          !error &&
          currentBooks.map((b) => (
            <BookCard
              key={b.id}
              id={b.id}
              title={b.title}
              author={b.author}
              price={b.price}
              image={b.image}
              rating={b.rating}
              status={b.status}
            />
          ))}
      </div>

      {/* Pagination frontend */}
      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            &lt;
          </button>

          {getPageNumbers(currentPage, totalPages).map((p, idx) =>
            p === "dots" ? (
              <span key={idx} className="dots">
                …
              </span>
            ) : (
              <button
                key={idx}
                className={currentPage === p ? "active" : ""}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            )
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </main>
  );
}
