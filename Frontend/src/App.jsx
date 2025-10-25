import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/Context";

// 🧩 Components chung
import Header from "@components/Header/Header";
import Sidebar from "@components/Sidebar/Sidebar";
import Footer from "@components/Footer/Footer";
import ProfileForm from "./Components/ProfileForm/ProfileForm";
import AdminApp from "./Components/AdminLayout/AdminApp/AdminApp";

// 🧩 Các trang người dùng
import BookList from "./pages/BookList/BookList";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AuthPassword from "./pages/AuthPassword/AuthPassword";
import SearchPage from "./pages/SreachPage/SearchPage";
import RegisterConfirmation from "./pages/Register/RegisterConfirmation";
import RegisterSuccess from "./pages/RegisterSuccess/RegisterSuccess";
import ResendConfirmation from "./pages/ResendConfirmation/ResendConfirmation";
import OrderTracking from "./Components/OrderTracking/OrderTracking";
import OrderHistory from "./Components/OrderHistory/OrderHistory";
import ReviewProduct from "./Components/ReviewProduct/ReviewProduct";
import Cart from "./Components/Cart/Cart"; // ✅ Thêm trang giỏ hàng mới

// 🧩 Route bảo vệ
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";

import "./App.css";

// --- Bộ lọc mặc định cho BookList ---
const defaultFilters = {
  price: "",
  status: "",
  rating: "",
  search: "",
};

// =============================
// 🧱 Layout chính của website
// =============================
function MainLayout() {
  const [categoryQuery, setCategoryQuery] = useState("");
  const [otherFilters, setOtherFilters] = useState(defaultFilters);
  const location = useLocation();

  // ✅ Ẩn Sidebar ở các trang không cần hiển thị nó
  const hideSidebarPaths = [
    "/orders",
    "/order-history",
    "/profile",
    "/review",
    "/cart", // ✅ Ẩn Sidebar trong giỏ hàng
  ];

  const hideSidebar = hideSidebarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="app">
      <Header />

      <div className="content">
        {/* ✅ Chỉ hiển thị Sidebar ở các trang chính */}
        {!hideSidebar && (
          <Sidebar
            onCategoryChange={setCategoryQuery}
            onFilterChange={setOtherFilters}
          />
        )}

        <main className={`main-view ${hideSidebar ? "full-width" : ""}`}>
          <Routes>
            {/* 🏠 Trang chủ */}
            <Route
              path="/"
              element={
                <BookList
                  categoryQuery={categoryQuery}
                  filters={otherFilters}
                />
              }
            />

            {/* 📖 Chi tiết sách */}
            <Route path="/book/:id" element={<ProductDetail />} />

            {/* 🔍 Trang tìm kiếm */}
            <Route path="/search" element={<SearchPage />} />

            {/* 🛒 Trang giỏ hàng */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            {/* 👤 Hồ sơ cá nhân */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileForm />
                </ProtectedRoute>
              }
            />

            {/* 🚚 Theo dõi đơn hàng */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderTracking />
                </ProtectedRoute>
              }
            />

            {/* 🧾 Lịch sử đơn hàng */}
            <Route
              path="/order-history"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />

            {/* ⭐ Trang đánh giá sản phẩm */}
            <Route
              path="/review/:id"
              element={
                <ProtectedRoute>
                  <ReviewProduct />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

// =============================
// 🔐 AppWrapper — quản lý trạng thái đăng nhập
// =============================
function AppWrapper() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        ⏳ Đang kiểm tra đăng nhập...
      </div>
    );
  }

  return (
    <Routes>
      {/* 🔓 Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<AuthPassword mode="forgot" />} />
      <Route path="/reset" element={<AuthPassword mode="reset" />} />
      <Route
        path="/register-confirmation"
        element={<RegisterConfirmation />}
      />
      <Route path="/register-success" element={<RegisterSuccess />} />
      <Route path="/resend-confirmation" element={<ResendConfirmation />} />

      {/* 🛠️ Trang admin */}
      <Route path="/admin" element={<AdminApp />} />

      {/* 🌐 Toàn bộ app chính */}
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
}

// =============================
// 🚀 App chính
// =============================
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}