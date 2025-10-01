import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ onFilter }) {
  const [filters, setFilters] = useState({
    category: "",
    price: "",
    status: "",
    rating: "",
  });

  // cấu hình filter groups
  const filterGroups = [
    {
      key: "category",
      label: "Thể loại",
      options: ["Thể loại 1", "Thể loại 2", "Thể loại 3"].map((c) => ({
        value: c,
        label: c,
      })),
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

  // chỉ cho chọn 1 option trong nhóm (toggle on/off)
  const handleSingleCheck = (value, groupName) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        [groupName]: prev[groupName] === value ? "" : value,
      };
      return updated;
    });
  };

  // reset toàn bộ filter
  const handleReset = () => {
    const cleared = { category: "", price: "", status: "", rating: "" };
    setFilters(cleared);
    onFilter({}); // báo cho cha: clear filter
  };

  // áp dụng filter hiện tại
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

      {/* Buttons */}
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
