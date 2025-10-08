import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Context";

export default function AdminRoute({ children }) {
  const { user, isLoggedIn, isLoading, refreshToken } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      refreshToken(); // tự gọi khi vào trang admin
    }
  }, [isLoggedIn]);

  if (isLoading) return <div>Đang xác thực...</div>;

  if (!isLoggedIn || !user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
