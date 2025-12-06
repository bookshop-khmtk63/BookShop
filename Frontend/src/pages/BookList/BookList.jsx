import React, { useState, useEffect } from "react";
import BookCard from "../BookCard/BookCard";
import "./BookList.css";

export default function BookList({ categoryQuery, filters }) {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const parsePrice = (p) => {
    if (typeof p === "number") return p;
    if (typeof p === "string") return Number(p.replace(/[^\d]/g, "")) || 0;
    return 0;
  };

  // ✅ Reset về trang đầu mỗi khi filter hoặc category đổi
  useEffect(() => {
    setCurrentPage(0);
  }, [categoryQuery, filters]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = [];

        // --- Lọc thể loại ---
        if (Array.isArray(categoryQuery) && categoryQuery.length > 0) {
          categoryQuery.forEach((cat) => {
            params.push(`filters=theLoai:${encodeURIComponent(cat)}`);
          });
        }

        // --- Lọc giá ---
        const min = parseInt(filters.minPrice);
        const max = parseInt(filters.maxPrice);

        if (!isNaN(min) && min > 0) {
          params.push(`filters=gia>=${min}`);
        }
        if (!isNaN(max) && max > 0) {
          params.push(`filters=gia<=${max}`);
        }

        // --- Lọc tình trạng ---
        if (filters.status === "available") params.push("filters=soLuong>0");
        else if (filters.status === "outofstock") params.push("filters=soLuong<=0");

        // --- Lọc đánh giá ---
 // --- Lọc đánh giá ---
if (filters.rating && !isNaN(filters.rating)) {
  
  params.push(`filters=diemTrungBinh>=${filters.rating}`);
}

        // --- Sắp xếp ---
        const sortParam = `sort=gia,${sortOrder}`;

        // --- Xác định endpoint ---
        const hasFilter = params.length > 0;
        let url = hasFilter
  ? `${API_URL}/api/books/filter?page=${currentPage}&size=6&${params.join("&")}&${sortParam}`
  : `${API_URL}/api/books/all?page=${currentPage}&size=6&${sortParam}`;
        

        console.log("📡 Gọi API:", url);
        console.log("🎯 categoryQuery:", categoryQuery);
        console.log("🎯 filters:", filters);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const pageData = json.data;
        const allBooks = pageData?.data || [];

        const mapped = allBooks.map((b) => ({
          id: b.id,
          title: b.nameBook,
          author: b.author || "Không rõ",
          price: b.price || 0,
          image: b.thumbnail,
          rating: parseFloat(b.averageRating) || 0,
          stock: b.soLuong ?? 1,
          status: b.soLuong > 0 ? "Còn hàng" : "Hết hàng",
        }));

        setBooks(mapped);
        setTotalPages(pageData.totalPages || 1);
        setTotalElements(pageData.totalElements || mapped.length);
      } catch (err) {
        console.error("❌ Lỗi tải sách:", err);
        setError("Không thể tải dữ liệu sách, vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [
    categoryQuery,
    filters.minPrice,
    filters.maxPrice,
    filters.status,
    filters.rating,
    sortOrder,
    API_URL,
    currentPage,
  ]);

  // --- Sắp xếp client-side fallback ---
  const sortedBooks = [...books].sort((a, b) =>
    sortOrder === "asc"
      ? parsePrice(a.price) - parsePrice(b.price)
      : parsePrice(b.price) - parsePrice(a.price)
  );

  // --- Tạo danh sách số trang ---
  const getPageNumbers = (current, total, delta = 1) => {
    const pages = [];
    const range = [];
    for (let i = 0; i < total; i++) {
      if (i === 0 || i === total - 1 || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }
    let lastPage = -1;
    for (let i of range) {
      if (i - lastPage > 1) pages.push("dots");
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
            setCurrentPage(0);
          }}
        >
          <option value="asc">Giá thấp → cao</option>
          <option value="desc">Giá cao → thấp</option>
        </select>
      </div>

      {loading && <p>Đang tải sách...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="no-books">Không tìm thấy sách phù hợp</p>
      )}

      <div className="grid">
        {!loading &&
          !error &&
          sortedBooks.map((b) => (
            <BookCard
              key={b.id}
              id={b.id}
              title={b.title}
              price={b.price}
              image={b.image}
              rating={b.rating}
              number={b.stock}
            />
          ))}
      </div>

      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            &lt;
          </button>

          {getPageNumbers(currentPage, totalPages).map((p, idx) =>
            p === "dots" ? (
              <span key={idx} className="dots">…</span>
            ) : (
              <button
                key={idx}
                className={currentPage === p ? "active" : ""}
                onClick={() => setCurrentPage(p)}
              >
                {p + 1}
              </button>
            )
          )}

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </main>
  );
}
