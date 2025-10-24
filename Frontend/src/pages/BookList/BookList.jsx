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

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `${API_URL}/api/books/all?page=0&size=1000`;
        const params = [];

        // Lọc thể loại
        if (Array.isArray(categoryQuery) && categoryQuery.length > 0) {
          categoryQuery.forEach((cat) => {
            params.push(`filters=theLoai:${encodeURIComponent(cat)}`);
          });
        }

        // Lọc trạng thái (còn / hết hàng)
        if (filters.status === "available") {
          params.push("filters=soLuong>0");
        } else if (filters.status === "outofstock") {
          params.push("filters=soLuong<=0");
        }

        // Lọc thủ công theo tồn kho
        if (filters.stock === "in") {
          params.push("filters=soLuong>0");
        } else if (filters.stock === "out") {
          params.push("filters=soLuong<=0");
        }

        if (params.length > 0) {
          url = `${API_URL}/api/books/filter?page=0&size=1000&${params.join("&")}`;
        }

        console.log("📡 Fetching books:", url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const json = await response.json();
        const rawBooks = json.data?.data || json.data?.content || [];

        // ✅ Gọi chi tiết từng sách để lấy tồn kho (vì API filter không trả về "number")
        const mapped = await Promise.all(
          rawBooks.map(async (b) => {
            try {
              const detailRes = await fetch(`${API_URL}/api/books/${b.id}`);
              if (!detailRes.ok) throw new Error("Lỗi lấy chi tiết sách");
              const detailJson = await detailRes.json();
              const d = detailJson.data || {};

              const stockValue = d.number ?? 0;

              return {
                id: d.id || b.id,
                title: d.nameBook || b.nameBook,
                author: d.author || "Không rõ",
                price: d.price || b.price || 0,
                image: d.thumbnail || b.thumbnail,
                rating: d.averageRating || parseFloat(b.averageRating) || 0,
                stock: stockValue,
                status: stockValue === 0 ? "Hết hàng" : "Còn hàng",
                categories: (d.category || []).map((c) => c.name),
              };
            } catch (error) {
              console.error("⚠️ Lỗi chi tiết sách:", error);
              return {
                id: b.id,
                title: b.nameBook,
                author: "Không rõ",
                price: b.price || 0,
                image: b.thumbnail,
                rating: parseFloat(b.averageRating) || 0,
                stock: 0,
                status: "Hết hàng",
                categories: [],
              };
            }
          })
        );

        console.table(mapped.map((b) => ({ title: b.title, stock: b.stock })));
        setBooks(mapped);
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

  // 🔹 Sắp xếp
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
          filteredBooks.length > 0 &&
          currentBooks.map((b) => (
            <BookCard
              key={b.id}
              id={b.id}
              title={b.title}
              author={b.author}
              price={b.price}
              image={b.image}
              rating={b.rating}
              number={b.stock} // ✅ đúng prop — BookCard dùng "number"
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
