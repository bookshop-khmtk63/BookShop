import React from "react";
import Sidebar from "./Sidebar";
import AddBookForm from "./AddBookForm";
import "./Header";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-right">
            <div className="avatar"></div>
          </div>
        </header>
        <section className="content">
          <AddBookForm />
        </section>
      </main>
    </div>
  );
}
