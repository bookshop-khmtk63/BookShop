import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ onCategoryChange, onFilterChange }) {
  const [categories, setCategories] = useState([]); // ✅ Mảng nhiều thể loại
  const [filters, setFilters] = useState({
    price: "",
    status: "",
    rating: "",
  });

  const categoryOptions = [
    "Tiểu thuyết",
    "Khoa học viễn tưởng",
    "Tự truyện",
    "Lịch sử",
    "Trinh thám",
    "Tâm lý học",
    "Kinh doanh",
    "Kỹ năng sống",
    "Triết học",
    "Văn học cổ điển",
    "Công nghệ thông tin",
    "Ngoại ngữ",
  ];

  // ✅ Toggle chọn / bỏ chọn thể loại
  const handleCategoryToggle = (category) => {
    let updated;
    if (categories.includes(category)) {
      updated = categories.filter((c) => c !== category);
    } else {
      updated = [...categories, category];
    }
    setCategories(updated);
  };

  // ✅ Cập nhật filter tạm thời
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  // ✅ Reset toàn bộ bộ lọc
  const handleReset = () => {
    setCategories([]);
    const cleared = { price: "", status: "", rating: "" };
    setFilters(cleared);
    onCategoryChange([]); // gửi mảng rỗng
    onFilterChange(cleared);
  };

  // ✅ Khi nhấn nút "Lọc"
  const applyFilters = () => {
    onCategoryChange(categories);
    onFilterChange(filters);
  };

  return (
    <aside className="sidebar">
      {/* ========== THỂ LOẠI ========== */}
      <div className="filter-group">
        <h4>Thể loại</h4>
        {categoryOptions.map((c) => (
          <label key={c}>
            <input
              type="checkbox"
              checked={categories.includes(c)}
              onChange={() => handleCategoryToggle(c)}
            />
            {c}
          </label>
        ))}
      </div>

      {/* ========== GIÁ ========== */}
      <div className="filter-group">
        <h4>Giá</h4>
        <label>
          <input
            type="checkbox"
            checked={filters.price === "under100"}
            onChange={() =>
              handleFilterChange(
                "price",
                filters.price === "under100" ? "" : "under100"
              )
            }
          />
          Dưới 100k
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.price === "100-500"}
            onChange={() =>
              handleFilterChange(
                "price",
                filters.price === "100-500" ? "" : "100-500"
              )
            }
          />
          100k - 500k
        </label>
      </div>

      {/* ========== TÌNH TRẠNG ========== */}
      <div className="filter-group">
        <h4>Tình trạng</h4>
        <label>
          <input
            type="checkbox"
            checked={filters.status === "available"}
            onChange={() =>
              handleFilterChange(
                "status",
                filters.status === "available" ? "" : "available"
              )
            }
          />
          Còn hàng
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.status === "outofstock"}
            onChange={() =>
              handleFilterChange(
                "status",
                filters.status === "outofstock" ? "" : "outofstock"
              )
            }
          />
          Hết hàng
        </label>
      </div>

      {/* ========== ĐÁNH GIÁ ========== */}
      <div className="filter-group">
        <h4>Đánh giá</h4>
        {[5, 4, 3, 2, 1].map((star) => (
          <label key={star}>
            <input
              type="checkbox"
              checked={filters.rating === String(star)}
              onChange={() =>
                handleFilterChange(
                  "rating",
                  filters.rating === String(star) ? "" : String(star)
                )
              }
            />
            {"⭐".repeat(star)}
          </label>
        ))}
      </div>

      {/* ========== NÚT HÀNH ĐỘNG ========== */}
      <div className="filter-btns">
        <button className="reset" onClick={handleReset}>
          Bỏ lọc
        </button>
        <button className="apply" onClick={applyFilters}>
          Lọc
        </button>
      </div>
    </aside>
  );
}
