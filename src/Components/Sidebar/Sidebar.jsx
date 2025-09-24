import React from "react";
import "./Sidebar.css";

export default function Sidebar() {
  // Hàm chỉ cho chọn 1 checkbox trong cùng nhóm
  const handleSingleCheck = (e, groupName) => {
    const checkboxes = document.getElementsByName(groupName);
    checkboxes.forEach((box) => {
      if (box !== e.target) box.checked = false;
    });
  };

  // Hàm bỏ lọc: bỏ chọn toàn bộ checkbox
  const handleReset = () => {
    const allCheckboxes = document.querySelectorAll("input[type='checkbox']");
    allCheckboxes.forEach((box) => (box.checked = false));
  };

  return (
    <aside className="sidebar">
      <h4>Thể loại</h4>
      <label>
        <input
          type="checkbox"
          name="category"
          onChange={(e) => handleSingleCheck(e, "category")}
        />{" "}
        Thể loại 1
      </label>
      <label>
        <input
          type="checkbox"
          name="category"
          onChange={(e) => handleSingleCheck(e, "category")}
        />{" "}
        Thể loại 2
      </label>
      <label>
        <input
          type="checkbox"
          name="category"
          onChange={(e) => handleSingleCheck(e, "category")}
        />{" "}
        Thể loại 3
      </label>

      <h4>Giá</h4>
      <label>
        <input
          type="checkbox"
          name="price"
          onChange={(e) => handleSingleCheck(e, "price")}
        />{" "}
        Dưới 100k
      </label>
      <label>
        <input
          type="checkbox"
          name="price"
          onChange={(e) => handleSingleCheck(e, "price")}
        />{" "}
        100k - 500k
      </label>

      <h4>Tình trạng</h4>
      <label>
        <input
          type="checkbox"
          name="status"
          onChange={(e) => handleSingleCheck(e, "status")}
        />{" "}
        Còn hàng
      </label>
      <label>
        <input
          type="checkbox"
          name="status"
          onChange={(e) => handleSingleCheck(e, "status")}
        />{" "}
        Hết hàng
      </label>

      <h4>Đánh giá</h4>
      <label>
        <input
          type="checkbox"
          name="rating"
          onChange={(e) => handleSingleCheck(e, "rating")}
        />{" "}
        ⭐⭐⭐⭐⭐ 
      </label>
      <label>
        <input
          type="checkbox"
          name="rating"
          onChange={(e) => handleSingleCheck(e, "rating")}
        />{" "}
        ⭐⭐⭐⭐ 
      </label>
      <label>
        <input
          type="checkbox"
          name="rating"
          onChange={(e) => handleSingleCheck(e, "rating")}
        />{" "}
        ⭐⭐⭐ 
      </label>
      <label>
        <input
          type="checkbox"
          name="rating"
          onChange={(e) => handleSingleCheck(e, "rating")}
        />{" "}
        ⭐⭐ 
      </label>
      <label>
        <input
          type="checkbox"
          name="rating"
          onChange={(e) => handleSingleCheck(e, "rating")}
        />{" "}
        ⭐
      </label>

      <div className="filter-btns">
        <button className="reset" onClick={handleReset}>
          Bỏ lọc
        </button>
        <button className="apply">Lọc</button>
      </div>
    </aside>
  );
}
