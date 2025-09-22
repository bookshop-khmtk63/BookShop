import React from "react";
import Header from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import BookList from "./Components/BookList/BookList";
import Footer from "./Components/Footer/Footer";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <Sidebar />
        <BookList />
      </div>
      <Footer />
    </div>
  );
}
