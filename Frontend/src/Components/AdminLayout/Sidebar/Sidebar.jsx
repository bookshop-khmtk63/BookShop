import React from "react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">Logo</div>
      <nav>
        <ul>
          <li><button>Thêm sách</button></li>
          <li><button>Sửa thông tin sách</button></li>
          <li><button>Xóa sách</button></li>
          <li><button>Thống kê</button></li>
          <li><button>Quản lý đơn hàng</button></li>
          <li><button>Quản lý đánh giá</button></li>
          <li><button>Quản lý tài người dùng</button></li>
        </ul>
      </nav>
    </aside>
  );
}
