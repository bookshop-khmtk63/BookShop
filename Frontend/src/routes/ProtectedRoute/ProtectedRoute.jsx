import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/Context";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();

  // Nếu đang load trạng thái đăng nhập, hiển thị loading
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        ...
      </div>
    );
  }

  // Nếu chưa đăng nhập, redirect về login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, render children
  return children;
}
