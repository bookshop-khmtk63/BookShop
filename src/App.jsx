import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/Context";

// Components
import Header from "@components/Header/Header";
import Sidebar from "@components/Sidebar/Sidebar";
import Footer from "@components/Footer/Footer";
import ProfileForm from "./Components/ProfileForm/ProfileForm";

// Pages
import BookList from "./pages/BookList/BookList";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AuthPassword from "./pages/AuthPassword/AuthPassword";
import SearchPage from "./pages/SreachPage/SearchPage";
import RegisterConfirmation from "./pages/Register/RegisterConfirmation";
import RegisterSuccess from "./pages/RegisterSuccess/RegisterSuccess";

// Protected Route
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";

import "./App.css";

// 👉 default filters cho frontend (price, status, rating, search)
const defaultFilters = {
  price: "",
  status: "",
  rating: "",
  search: "",
};

function MainLayout() {
  // query string cho filter category API
  const [categoryQuery, setCategoryQuery] = useState("");
  // các filter frontend
  const [otherFilters, setOtherFilters] = useState(defaultFilters);

  return (
    <div className="app">
      <Header />
      <div className="content">
        {/* Sidebar gửi cả category API + các filter frontend */}
        <Sidebar
          onCategoryChange={setCategoryQuery}
          onFilterChange={setOtherFilters}
        />
        <main className="main-view">
          <Routes>
            <Route
              path="/"
              element={
                <BookList
                  categoryQuery={categoryQuery}
                  filters={otherFilters}
                />
              }
            />
            <Route path="/book/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileForm />
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

function AppWrapper() {
  const { isLoading } = useAuth();

  if (isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        ⏳ Đang kiểm tra đăng nhập...
      </div>
    );

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<AuthPassword mode="forgot" />} />
      <Route path="/reset" element={<AuthPassword mode="reset" />} />
      <Route
        path="/register-confirmation"
        element={<RegisterConfirmation />}
      />
      <Route path="/register-success" element={<RegisterSuccess />} />

      {/* Main app */}
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}
