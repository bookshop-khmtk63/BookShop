import React, { useState, useEffect } from "react";
import BookCard from "../../Components/BookCard/BookCard";
import "./BookList.css";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 6;
  const API_URL = import.meta.env.VITE_API_URL;

  const parsePrice = (p) => {
    if (typeof p === "number") return p;
    if (typeof p === "string") return Number(p.replace(/[^\d]/g, "")) || 0;
    return 0;
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/books/all`) // gọi thẳng backend domain
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
          rating: b.averageRating,
        }));
        setBooks(mapped);
      })
      .catch((err) => setError("Không thể tải dữ liệu sách, vui lòng thử lại sau."))
      .finally(() => setLoading(false));
  }, [API_URL]);

  const sortedBooks = [...books].sort((a, b) =>
    sortOrder === "asc" ? parsePrice(a.price) - parsePrice(b.price) : parsePrice(b.price) - parsePrice(a.price)
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(books.length / itemsPerPage);

  return (
    <main className="book-list">
      <div className="sort">
        <label>Sắp xếp: </label>
        <select
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
        >
          <option value="asc">Giá thấp → cao</option>
          <option value="desc">Giá cao → thấp</option>
        </select>
      </div>

      {loading && <p>Đang tải sách...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="grid">
        {!loading && !error &&
          currentBooks.map((b) => (
            <BookCard
              key={b.id}
              id={b.id}
              title={b.title}
              author={b.author}
              price={b.price}
              image={b.image}
              rating={b.rating}
            />
          ))
        }
      </div>

      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>&gt;</button>
        </div>
      )}
    </main>
  );
}
