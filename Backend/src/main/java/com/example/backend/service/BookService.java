package com.example.backend.service;

import com.example.backend.dto.request.CreateBookRequest;
import com.example.backend.dto.request.UpdateBookRequest;
import com.example.backend.dto.response.BookAdminResponse;
import com.example.backend.dto.response.BookDetailResponse;
import com.example.backend.dto.response.BookResponse;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.model.Book;
import com.example.backend.model.GioHangChiTiet;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface BookService {
    PageResponse<BookResponse> getAllBooks(int page, int size);

    BookDetailResponse getBookById(int id);

    PageResponse<BookResponse> filterBooks(Pageable pageable, List<String> filter);

    PageResponse<BookResponse> advancedSearch(String keyword, int page, int size);

    PageResponse<BookAdminResponse>AdmingetAllBook(Pageable pageable);

    BookDetailResponse createBook(@Valid CreateBookRequest createBookRequest, MultipartFile thumbnail);

    BookDetailResponse updateBook(@Valid UpdateBookRequest updateBookRequest, MultipartFile thumbnail,int id);

    void deleteBook(Integer id);

    Book getBookByIds(@NotNull(message = "ID sách không được để trống") Integer bookId);


}
