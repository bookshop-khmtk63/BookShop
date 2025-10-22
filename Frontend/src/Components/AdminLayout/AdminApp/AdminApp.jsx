// AdminApp.jsx
import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import AdminHeader from "../AdminHeader";

// 📚 Quản lý sách
import AddBook from "../../../pages/Admin/AddBook/AddBook";
import BookTable from "../../../pages/Admin/BookTable/BookTable";
import BookUpdateTable from "../../../pages/Admin/BookUpdate/BookUpdateTable/BookUpdateTable";
import BookUpdate from "../../../pages/Admin/BookUpdate/BookUpdate";

// 📦 Quản lý 
import OrderManager from "../../OrderManager/OrderManager"; 

import Statistics from "../../Statistics/Statistics";
import ReviewManager from "../../ReviewManager/ReviewManager";
import AccountManager from "../../AccountManager/AccountManager";

import "../AdminLayout.css";

export default function AdminApp() {
  const [selectedMenu, setSelectedMenu] = useState("Thêm sách");
  const [updatingBookId, setUpdatingBookId] = useState(null); // book đang cập nhật

  return (
    <div className="admin-layout">
      {/* 🧭 Sidebar */}
      <AdminSidebar onMenuSelect={setSelectedMenu} />

      {/* 📋 Phần nội dung chính */}
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          {/* ✅ Nếu đang update thì chỉ hiển thị giao diện sửa sách */}
          {updatingBookId ? (
            <BookUpdate
              id={updatingBookId}
              onBack={() => setUpdatingBookId(null)}
            />
          ) : (
            <>
              {/* ================== MENU SÁCH ================== */}
              {selectedMenu === "Thêm sách" && <AddBook />}
              {selectedMenu === "Xóa sách" && <BookTable />}
              {selectedMenu === "Sửa thông tin sách" && (
                <BookUpdateTable onUpdate={(id) => setUpdatingBookId(id)} />
              )}

              {/* ================== MENU QUẢN LÝ ================== */}
              {selectedMenu === "Quản lý đơn hàng" && <OrderManager />}
              {selectedMenu === "Thống kê" && <Statistics />}
              {selectedMenu === "Quản lý đánh giá" && <ReviewManager />}
              {selectedMenu === "Quản lý người dùng" && <AccountManager />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
