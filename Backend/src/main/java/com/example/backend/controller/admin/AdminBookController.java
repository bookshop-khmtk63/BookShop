package com.example.backend.controller.admin;

import com.example.backend.dto.request.CreateBookRequest;
import com.example.backend.dto.request.UpdateBookRequest;
import com.example.backend.dto.response.BookAdminResponse;
import com.example.backend.dto.response.BookDetailResponse;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.sql.Update;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/admin")
public class AdminBookController {
    private final BookService bookService;
    @GetMapping("/get-all-book")
    public ResponseEntity<ResponseData<PageResponse<BookAdminResponse>>> getAllBook(@PageableDefault(size = 6,sort = "idSach") Pageable pageable) {
        PageResponse<BookAdminResponse> bookAdminResponse = bookService.AdmingetAllBook(pageable);
        ResponseData<PageResponse<BookAdminResponse>> bookAdminResponseResponseData = new ResponseData<>(200,"success",bookAdminResponse);
        return ResponseEntity.ok(bookAdminResponseResponseData);
    }
    @PostMapping("/create-book")
    public ResponseEntity<ResponseData<BookDetailResponse>> createBook(@Valid @RequestPart CreateBookRequest createBookRequest,
                                                                       @RequestPart(required = false) MultipartFile thumbnail) {
        BookDetailResponse bookDetailResponse =  bookService.createBook(createBookRequest,thumbnail);
        ResponseData<BookDetailResponse> bookDetailResponseData = new ResponseData<>(200,"success",bookDetailResponse);
        return ResponseEntity.ok(bookDetailResponseData);
    }

    @PutMapping("/update-book/{id}")
    public ResponseEntity<ResponseData<BookDetailResponse>> updateBook(@Valid @RequestPart UpdateBookRequest updateBookRequest,
                                                                       @RequestPart(required = false) MultipartFile thumbnail,@PathVariable Integer id) {
        BookDetailResponse bookDetailResponse =  bookService.updateBook(updateBookRequest,thumbnail,id);
        ResponseData<BookDetailResponse> bookDetailResponseData = new ResponseData<>(200,"success",bookDetailResponse);
        return ResponseEntity.ok(bookDetailResponseData);
    }
    @DeleteMapping("/delete-book/{id}")
    public ResponseEntity<ResponseData<BookDetailResponse>> deleteBook(@PathVariable Integer id) {
          bookService.deleteBook(id);
        ResponseData<BookDetailResponse> bookDetailResponseData = new ResponseData<>(200,"success",null);
        return ResponseEntity.ok(bookDetailResponseData);
    }

}
