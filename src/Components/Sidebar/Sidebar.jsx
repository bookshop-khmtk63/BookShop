import React from "react";
import './Sidebar.css'
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h4>Thể loại</h4>
      <label><input type="checkbox" /> Thể loại 1</label>
      <label><input type="checkbox" /> Thể loại 2</label>
      <label><input type="checkbox" /> Thể loại 3</label>

      

      <h4>Giá</h4>
      <label><input type="checkbox" /> Dưới 100k</label>
      <label><input type="checkbox" /> 100k - 500k</label>

      <h4>Tình trạng</h4>
      <label><input type="checkbox" /> Còn hàng</label>
      <label><input type="checkbox" /> Hết hàng</label>

      <div className="filter-btns">
        <button className="reset">Bỏ lọc</button>
        <button className="apply">Lọc</button>
      </div>
    </aside>
  );
}
