// AdminApp.jsx
import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import AdminHeader from "../AdminHeader";
import AddBook from "../../../pages/Admin/AddBook/AddBook";
import BookTable from "../../../pages/Admin/BookTable/BookTable";
import BookUpdateTable from "../../../pages/Admin/BookUpdate/BookUpdateTable/BookUpdateTable";
import BookUpdate from "../../../pages/Admin/BookUpdate/BookUpdate";
import "../AdminLayout.css";

export default function AdminApp() {
  const [selectedMenu, setSelectedMenu] = useState("Thêm sách");
  const [updatingBookId, setUpdatingBookId] = useState(null); // book đang cập nhật

  return (
    <div className="admin-layout">
      <AdminSidebar onMenuSelect={setSelectedMenu} />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          {/* Nếu đang update thì hiện BookUpdate */}
          {updatingBookId ? (
            <BookUpdate
              id={updatingBookId}
              onBack={() => setUpdatingBookId(null)}
            />
          ) : (
            <>
              {selectedMenu === "Thêm sách" && <AddBook />}
              {selectedMenu === "Xóa sách" && <BookTable />}
              {selectedMenu === "Sửa thông tin sách" && (
                <BookUpdateTable onUpdate={(id) => setUpdatingBookId(id)} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
