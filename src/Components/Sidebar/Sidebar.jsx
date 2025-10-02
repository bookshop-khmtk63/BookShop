import React, { useState, useEffect } from "react";
import "./Sidebar.css";

export default function Sidebar({ onFilter }) {
  const [filters, setFilters] = useState({
    category: "",
    price: "",
    status: "",
    rating: "",
  });

  const [categories, setCategories] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // Lấy categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/books/category`);
        if (!res.ok) throw new Error("Lỗi khi tải thể loại");
        const result = await res.json();

        const categoriesArray = Array.isArray(result.data) ? result.data : [];

        setCategories(
          categoriesArray.map((c) => ({
            value: c.id,   // id để filter
            label: c.name, // tên hiển thị
          }))
        );
      } catch (err) {
        console.error("❌ Lỗi tải categories:", err);
      }
    };
    fetchCategories();
  }, [API_URL]);

  // cấu hình filter groups
  const filterGroups = [
    {
      key: "category",
      label: "Thể loại",
      options: categories,
    },
    {
      key: "price",
      label: "Giá",
      options: [
        { value: "under100", label: "Dưới 100k" },
        { value: "100-500", label: "100k - 500k" },
      ],
    },
    {
      key: "status",
      label: "Tình trạng",
      options: [
        { value: "available", label: "Còn hàng" },
        { value: "out", label: "Hết hàng" },
      ],
    },
    {
      key: "rating",
      label: "Đánh giá",
      options: [5, 4, 3, 2, 1].map((star) => ({
        value: String(star),
        label: "⭐".repeat(star),
      })),
    },
  ];

  const handleSingleCheck = (value, groupName) => {
    setFilters((prev) => ({
      ...prev,
      [groupName]: prev[groupName] === value ? "" : value,
    }));
  };

  const handleReset = () => {
    setFilters({ category: "", price: "", status: "", rating: "" });
    onFilter({});
  };

  const handleApply = () => {
    onFilter(filters);
  };

  return (
    <aside className="sidebar">
      {filterGroups.map((group) => (
        <div key={group.key} className="filter-group">
          <h4>{group.label}</h4>
          {group.options.map((opt) => (
            <label key={opt.value}>
              <input
                type="checkbox"
                checked={filters[group.key] === opt.value}
                onChange={() => handleSingleCheck(opt.value, group.key)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      ))}

      <div className="filter-btns">
        <button className="reset" onClick={handleReset}>
          Bỏ lọc
        </button>
        <button className="apply" onClick={handleApply}>
          Lọc
        </button>
      </div>
    </aside>
  );
}
