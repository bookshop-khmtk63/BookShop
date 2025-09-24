import React, { useState, useEffect } from "react";
import BookCard from "../BookCard/BookCard";
import "./BookList.css";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");

  const itemsPerPage = 6;

  // Hàm convert "120.000đ" -> 120000
  const parsePrice = (p) => Number(p.replace(/[^\d]/g, ""));

  // Lấy dữ liệu từ file JSON trong public/
  useEffect(() => {
    fetch("/books.json") // nhớ đổi file thành books.json
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Lỗi fetch:", err));
  }, []);

  // Sort theo giá
  const sortedBooks = [...books].sort((a, b) => {
    if (sortOrder === "asc") return parsePrice(a.price) - parsePrice(b.price);
    return parsePrice(b.price) - parsePrice(a.price);
  });

  // Tính toán sách cho trang hiện tại
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(books.length / itemsPerPage);

  return (
    <main className="book-list">
      {/* Bộ lọc sắp xếp */}
      <div className="sort">
        <label>Sắp xếp: </label>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1); // reset về trang 1 khi đổi sort
          }}
        >
          <option value="asc">Giá thấp → cao</option>
          <option value="desc">Giá cao → thấp</option>
        </select>
      </div>

      {/* Lưới hiển thị sách */}
      <div className="grid">
        {currentBooks.map((b) => (
          <BookCard
            key={b.id}
            id={b.id}
            title={b.title}
            author={b.author}
            price={b.price}
            image={b.image}
            rating={b.rating}
          />
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          &gt;
        </button>
      </div>
    </main>
  );
}
