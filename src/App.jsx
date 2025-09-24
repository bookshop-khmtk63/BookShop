import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import BookList from "./Components/BookList/BookList";
import Footer from "./Components/Footer/Footer";
import ProductDetail from "./Components/ProductDetail/ProductDetail"; // import chi tiết
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
