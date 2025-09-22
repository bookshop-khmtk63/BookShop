package com.example.backend.service;

import com.example.backend.dto.response.BookResponse;
import com.example.backend.dto.response.PageResponse;
import org.springframework.stereotype.Service;

import java.util.List;


public interface BookService {
    PageResponse<BookResponse> getAllBooks(int page, int size);

    BookResponse getBookById(int id);

    PageResponse<BookResponse> filterBooks(int page, int size, List<String> filter);

    PageResponse<BookResponse> advancedSearch(String keyword, int page, int size);
}
