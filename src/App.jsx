import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@components/Header/Header";
import Sidebar from "@components/Sidebar/Sidebar";
import Footer from "@components/Footer/Footer";
import BookList from "./pages/BookList/BookList";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="content">
          <Sidebar />

          {/* Các route */}
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/book/:id" element={<ProductDetail />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
