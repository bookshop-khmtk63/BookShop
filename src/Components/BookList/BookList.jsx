import React, { useState, useEffect } from "react";
import BookCard from "../BookCard/BookCard";
import "./BookList.css";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");

  const itemsPerPage = 6;

  // Hàm convert price -> number
  const parsePrice = (p) => {
    if (typeof p === "number") return p;
    if (typeof p === "string") return Number(p.replace(/[^\d]/g, "")) || 0;
    return 0;
  };

  // Gọi API
  useEffect(() => {
    fetch("/api/books/all")
      .then((res) => res.json())
      .then((json) => {
        const rawBooks = json.data?.data || [];

        // Map sang định dạng BookCard cần
        const mapped = rawBooks.map((b) => ({
          id: b.id,
          title: b.nameBook,
          author: "Không rõ", // API chưa có tác giả
          price: b.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
          image: b.thumbnail,
          rating: b.averageRating,
        }));

        setBooks(mapped);
      })
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
            setCurrentPage(1);
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
