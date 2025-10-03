import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import BookList from "../BookList/BookList";
import "./BooksPage.css";

export default function BooksPage() {
  const [filtersUrl, setFiltersUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  return (
    <div className="books-page">
      <Sidebar onFilterChange={setFiltersUrl} />
      <BookList
        filtersUrl={filtersUrl}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />
    </div>
  );
}
