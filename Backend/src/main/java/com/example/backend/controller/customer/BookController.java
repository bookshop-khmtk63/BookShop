package com.example.backend.controller.customer;

import com.example.backend.dto.response.BookResponse;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.dto.response.ResponseData;
//import com.example.backend.model.BookElasticsearch;
//import com.example.backend.service.BookSearchService;
import com.example.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/books")
public class BookController {
    private final BookService bookService;
    //private final BookSearchService bookSearchService;
    @GetMapping("/all")
    public ResponseEntity<ResponseData<PageResponse<BookResponse>>> getAllBooks(@RequestParam(defaultValue = "0") int page,
                                                                                @RequestParam(defaultValue = "6") int size) {
        PageResponse<BookResponse> allBook = bookService.getAllBooks(page,size);
        ResponseData<PageResponse<BookResponse>> responseData = new ResponseData<>(200,"success",allBook);
        return ResponseEntity.ok(responseData);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<BookResponse>> getBookById(@PathVariable("id") int id) {
        BookResponse book = bookService.getBookById(id);
        ResponseData<BookResponse> responseData = new ResponseData<>(200,"success",book);
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
    public ResponseEntity<ResponseData<PageResponse<BookResponse>>> SearchFilter (@RequestParam(defaultValue = "0") int page,
                                                                                         @RequestParam(defaultValue = "12") int size,
                                                                                  @RequestParam (required = false, name = "filters") List<String> filters ){
        PageResponse<BookResponse> searchFilter = bookService.filterBooks(page,size,filters);
        ResponseData<PageResponse<BookResponse>> responseData =new ResponseData<>(200,"Success", searchFilter);
        return ResponseEntity.ok(responseData);
    }
}
