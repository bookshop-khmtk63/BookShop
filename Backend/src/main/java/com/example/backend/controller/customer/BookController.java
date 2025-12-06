package com.example.backend.controller.customer;

import com.example.backend.dto.response.*;
//import com.example.backend.model.BookElasticsearch;
//import com.example.backend.service.BookSearchService;
import com.example.backend.service.BookService;
import com.example.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/books")

public class BookController {
    private final BookService bookService;
    private final CategoryService categoryService;
    //private final BookSearchService bookSearchService;
    @GetMapping("/all")
    public ResponseEntity<ResponseData<PageResponse<BookResponse>>> getAllBooks(@RequestParam(defaultValue = "0") int page,
                                                                                @RequestParam(defaultValue = "6") int size) {
        PageResponse<BookResponse> allBook = bookService.getAllBooks(page,size);
        ResponseData<PageResponse<BookResponse>> responseData = new ResponseData<>(200,"success",allBook);
        return ResponseEntity.ok(responseData);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<BookDetailResponse>> getBookById(@PathVariable("id") int id) {
        BookDetailResponse book = bookService.getBookById(id);
        ResponseData<BookDetailResponse> responseData = new ResponseData<>(200,"success",book);
        return ResponseEntity.ok(responseData);
    }
//    @GetMapping("/search-es")
//    public ResponseEntity<ResponseData<PageResponse<BookElasticsearch>>> searchBook(@RequestParam(required = false) String keyword,
//                                                                      @RequestParam(defaultValue = "0") int page,
//                                                                      @RequestParam(defaultValue = "6") int size) {
//
//
//        PageResponse<BookElasticsearch> pageBook = bookSearchService.advancedSearch(keyword,page,size);
//        ResponseData<PageResponse<BookElasticsearch>> responseData = new ResponseData<>(200,"success",pageBook);
//        return ResponseEntity.ok(responseData);
//    }
        @GetMapping("/search-es")
    public ResponseEntity<ResponseData<PageResponse<BookResponse>>> searchBook(@RequestParam(required = false) String keyword,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "6") int size) {
        PageResponse<BookResponse> pageBook = bookService.advancedSearch(keyword,page,size);
        ResponseData<PageResponse<BookResponse>> responseData = new ResponseData<>(200,"success",pageBook);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/filter")
    public ResponseEntity<ResponseData<PageResponse<BookResponse>>> SearchFilter ( Pageable pageable,
                                                                                  @RequestParam (required = false, name = "filters") List<String> filters ){
        PageResponse<BookResponse> searchFilter = bookService.filterBooks(pageable,filters);
        ResponseData<PageResponse<BookResponse>> responseData =new ResponseData<>(200,"Success", searchFilter);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/category")
    public ResponseEntity<ResponseData<List<CategoryResponse>>> getAllCategory() {
            List<CategoryResponse> categoryResponseList =  categoryService.getAllCategory();
            ResponseData<List<CategoryResponse>> responseData = new ResponseData<>(200,"success",categoryResponseList);
            return ResponseEntity.ok(responseData);
           }


}
