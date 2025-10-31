package com.example.backend.controller.admin;

import com.example.backend.dto.request.CreateBookRequest;
import com.example.backend.dto.request.UpdateBookRequest;
import com.example.backend.dto.request.UpdateOrderStatusRequest;
import com.example.backend.dto.response.*;
import com.example.backend.model.CustomUserDetails;
import com.example.backend.service.*;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.hibernate.sql.Update;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/admin")
public class AdminBookController {
    private final BookService bookService;
    private final AuthorService authorService;
    private final CustomerService customerService;
    private final BookReviewService bookReviewService;
    private final OrderService orderService;
    @GetMapping("/get-all-book")
    public ResponseEntity<ResponseData<PageResponse<BookAdminResponse>>> getAllBook(@PageableDefault(page = 0,size = 6,sort = "idSach") Pageable pageable) {
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
    @GetMapping("/get-all-author")
    public ResponseEntity<ResponseData<List<AuthorResponse>>> getAllAuthor() {
        List<AuthorResponse> authorResponse = authorService.getAllAuthor();
        ResponseData<List<AuthorResponse>> authorResponseData = new ResponseData<>(200,"success",authorResponse);
        return ResponseEntity.ok(authorResponseData);
    }
    @GetMapping("/get-all-user")
    public ResponseEntity<ResponseData<PageResponse<UserResponse>>> getAllUser(@PageableDefault(page = 0,size = 8,sort = "ngayDangKy",direction = Sort.Direction.DESC)
                                                                                   Pageable pageable) {
        PageResponse<UserResponse> listUser =customerService.getAllUser(pageable);
        ResponseData<PageResponse<UserResponse>> userResponseData = new ResponseData<>(200,"success",listUser);
        return ResponseEntity.ok(userResponseData);
    }
    @PutMapping ("/locked/{userId}")
    public ResponseEntity<ResponseData<?>> lockUser(@PathVariable Integer userId) {
        customerService.lockUser(userId);
        ResponseData<?> responseData = new ResponseData<>(200,"Bạn đã khóa tài khoản thành công",null);
        return ResponseEntity.ok(responseData);
    }
    @PutMapping("/unlock/{userId}")
    public ResponseEntity<ResponseData<?>> unlockUser(@PathVariable Integer userId) {
        customerService.unLock(userId);
        ResponseData<?> responseData =  new ResponseData<>(200,"Bạn đã mở khóa tài khoản thành công",null);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/review-all")
    public ResponseEntity<ResponseData<PageResponse<BookReviewResponse>>> getAllReview(@PageableDefault (page = 0,size = 10,sort = "ngayDanhGia",direction = Sort.Direction.DESC) Pageable pageable) {
            PageResponse<BookReviewResponse> reviewResponsePageResponse = bookReviewService.getAllReview(pageable);
            ResponseData<PageResponse<BookReviewResponse>> reviewResponseData = new ResponseData<>(200,"success",reviewResponsePageResponse);
            return ResponseEntity.ok(reviewResponseData);

    }

    @DeleteMapping("/review/{id}")
    public ResponseEntity<ResponseData<?>> DeleteReview(@PathVariable Integer id) {
        bookReviewService.deleteReview(id);
        ResponseData<?> responseData = new ResponseData<>(200,"Xóa thành công review",null);
        return ResponseEntity.ok(responseData);
    }
    @GetMapping("/statistics/revenue")
    public ResponseEntity<ResponseData<RevenueStatisticsResponse>> getRevenueStatistics(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "daily") String period) {

        RevenueStatisticsResponse response = orderService.getRevenueStatistics(startDate, endDate, period);
        ResponseData<RevenueStatisticsResponse> responseData = new ResponseData<>(200,"success",response);
        return ResponseEntity.ok(responseData);
    }


}
