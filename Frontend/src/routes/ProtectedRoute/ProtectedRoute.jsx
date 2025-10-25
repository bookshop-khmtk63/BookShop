import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/Context";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading, user } = useAuth();
  const location = useLocation();

  // 🔹 Hiển thị trạng thái loading trong khi chờ xác thực
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontSize: "20px" }}>
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  // 🔹 Nếu chưa đăng nhập → chuyển về trang đăng nhập
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 🔹 Nếu đăng nhập nhưng không có role (dữ liệu lỗi)
  if (!user?.role) {
    console.warn("⚠️ Không xác định được vai trò người dùng!");
    return <Navigate to="/login" replace />;
  }

  // ===================== PHÂN QUYỀN =====================

  // Nếu là ADMIN mà đang vào đường dẫn /user → chặn
  if (user.role === "ADMIN" && location.pathname.startsWith("/user")) {
    return <Navigate to="/admin" replace />;
  }

  // Nếu là USER mà đang vào đường dẫn /admin → chặn
  if (user.role === "USER" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/user" replace />;
  }

  // ✅ Nếu mọi điều kiện hợp lệ → cho phép render
  return children;
}
