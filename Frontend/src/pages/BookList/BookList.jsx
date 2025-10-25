import React, { useState, useEffect } from "react";
import BookCard from "../BookCard/BookCard";
import "./BookList.css";

export default function BookList({ categoryQuery, filters }) {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 6;
  const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 Chuyển giá sang số để sắp xếp
  const parsePrice = (p) => {
    if (typeof p === "number") return p;
    if (typeof p === "string") return Number(p.replace(/[^\d]/g, "")) || 0;
    return 0;
  };

  // ⚙️ Fetch danh sách sách (chỉ dùng /all hoặc /filter)
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = [];

        // Lọc thể loại
        if (Array.isArray(categoryQuery) && categoryQuery.length > 0) {
          categoryQuery.forEach((cat) => {
            params.push(`filters=theLoai:${encodeURIComponent(cat)}`);
          });
        }

        // Lọc trạng thái (nếu có)
        if (filters.status === "available") params.push("filters=soLuong>0");
        else if (filters.status === "outofstock") params.push("filters=soLuong<=0");

        // Chọn API phù hợp
        let baseUrl =
          params.length > 0
            ? `${API_URL}/api/books/filter`
            : `${API_URL}/api/books/all`;

        let allBooks = [];
        let page = 0;
        let totalPages = 1;

        // Gọi tất cả các trang (tránh giới hạn page size)
        while (page < totalPages) {
          const url = `${baseUrl}?page=${page}${params.length ? "&" + params.join("&") : ""}`;
          console.log("📡 Fetching page:", page, url);

          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const json = await res.json();
          const data = json.data?.data || json.data?.content || [];

          allBooks = [...allBooks, ...data];
          totalPages = json.data?.totalPages || 1;
          page++;
        }

        // ✅ Không cần gọi API chi tiết nữa
        const mapped = allBooks.map((b) => ({
          id: b.id,
          title: b.nameBook,
          author: b.author || "Không rõ",
          price: b.price || 0,
          image: b.thumbnail,
          rating: parseFloat(b.averageRating) || 0,
          stock: 1, // 🔹 Giả sử mặc định còn hàng
          status: "Còn hàng",
          categories: [],
        }));

        setBooks(mapped);
        console.log("✅ Đã tải sách:", mapped.length);
      } catch (err) {
        console.error("❌ Lỗi tải sách:", err);
        setError("Không thể tải dữ liệu sách, vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [categoryQuery, filters.status, filters.stock, API_URL]);

  // 🔹 Lọc phía frontend
  const filteredBooks = books.filter((book) => {
    if (filters.search && !book.title.toLowerCase().includes(filters.search.toLowerCase()))
      return false;

    if (filters.price === "under100" && parsePrice(book.price) >= 100000) return false;

    if (
      filters.price === "100-500" &&
      (parsePrice(book.price) < 100000 || parsePrice(book.price) > 500000)
    )
      return false;

    if (filters.rating && book.rating < Number(filters.rating)) return false;

    return true;
  });

  // 🔹 Sắp xếp theo giá
  const sortedBooks = [...filteredBooks].sort((a, b) =>
    sortOrder === "asc"
      ? parsePrice(a.price) - parsePrice(b.price)
      : parsePrice(b.price) - parsePrice(a.price)
  );

  // 🔹 Phân trang
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const getPageNumbers = (currentPage, totalPages, delta = 1) => {
    const pages = [];
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
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

  // ==================== JSX ====================
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
      {!loading && !error && filteredBooks.length === 0 && (
        <p className="no-books">Không tìm thấy sách phù hợp</p>
      )}

      <div className="grid">
        {!loading &&
          !error &&
          currentBooks.map((b) => (
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
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
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
