import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ onCategoryChange, onFilterChange }) {
  const [category, setCategory] = useState("");
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

  // chọn category tạm thời
  const handleCategory = (c) => {
    const newCategory = category === c ? "" : c;
    setCategory(newCategory);
  };

  // thay đổi filter tạm thời
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  // reset toàn bộ bộ lọc
  const handleReset = () => {
    setCategory("");
    const cleared = { price: "", status: "", rating: "" };
    setFilters(cleared);
    // khi reset thì gửi luôn về cha
    onCategoryChange("");
    onFilterChange(cleared);
  };

  // khi nhấn nút "Lọc"
  const applyFilters = () => {
    onCategoryChange(category);
    onFilterChange(filters);
  };

  return (
    <aside className="sidebar">
      <div className="filter-group">
        <h4>Thể loại</h4>
        {categoryOptions.map((c) => (
          <label key={c}>
            <input
              type="checkbox"
              checked={category === c}
              onChange={() => handleCategory(c)}
            />
            {c}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Giá</h4>
        <label>
          <input
            type="checkbox"
            checked={filters.price === "under100"}
            onChange={() =>
              handleFilterChange("price", filters.price === "under100" ? "" : "under100")
            }
          />
          Dưới 100k
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.price === "100-500"}
            onChange={() =>
              handleFilterChange("price", filters.price === "100-500" ? "" : "100-500")
            }
          />
          100k - 500k
        </label>
      </div>

      <div className="filter-group">
        <h4>Tình trạng</h4>
        <label>
          <input
            type="checkbox"
            checked={filters.status === "available"}
            onChange={() =>
              handleFilterChange("status", filters.status === "available" ? "" : "available")
            }
          />
          Còn hàng
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.status === "out"}
            onChange={() =>
              handleFilterChange("status", filters.status === "out" ? "" : "out")
            }
          />
          Hết hàng
        </label>
      </div>

      <div className="filter-group">
        <h4>Đánh giá</h4>
        {[5, 4, 3, 2, 1].map((star) => (
          <label key={star}>
            <input
              type="checkbox"
              checked={filters.rating === String(star)}
              onChange={() =>
                handleFilterChange("rating", filters.rating === String(star) ? "" : String(star))
              }
            />
            {"⭐".repeat(star)}
          </label>
        ))}
      </div>

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
