package com.example.backend.controller.customer;

import com.example.backend.dto.request.CartItemRequest;
import com.example.backend.dto.request.CreateReviewRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.*;
import com.example.backend.mapper.CustomerMapper;
import com.example.backend.model.CustomUserDetails;
import com.example.backend.model.KhachHang;
import com.example.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('USER')")
public class CustomerController {
    private final CustomerService customerService;
    private final CustomerMapper customerMapper;
    private final OrderService orderService;
    private final BookReviewService bookReviewService;
    private final CartService cartService;
    private final CartItemService cartItemService;
  //API Cập nhật thông tin người dùng
  @PatchMapping("/update-customer")
    public ResponseEntity<ResponseData<CustomerResponse>> updateCustomer(@Valid @RequestBody UserUpdateRequest userUpdateRequest) {
      CustomerResponse customerResponse = customerService.updateCustomer(userUpdateRequest);
      ResponseData<CustomerResponse> responseData = new ResponseData<>(200,"success",customerResponse);
      return new ResponseEntity<>(responseData, HttpStatus.OK);
  }
  @GetMapping("/me")
  public ResponseEntity<ResponseData<CustomerResponse>> getCustomer(@AuthenticationPrincipal UserDetails userDetails) {
      KhachHang customer = customerService.getCustomerByEmail(userDetails.getUsername());
      ResponseData<CustomerResponse> responseData = new ResponseData<>(200,"success",customerMapper.toCustomerResponse(customer));
      return new ResponseEntity<>(responseData, HttpStatus.OK);
  }
  @GetMapping("/history-order")
    public ResponseEntity<ResponseData<PageResponse<OrderDetailResponse>>> getHistoryOrder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                                           @PageableDefault(page = 0,size = 3,sort ="ngayDat",direction = Sort.Direction.DESC)
                                                                             Pageable pageable) {
    PageResponse<OrderDetailResponse> order = orderService.getAllOrder(userDetails.getUser().getIdKhachHang(),pageable);
    ResponseData<PageResponse<OrderDetailResponse>> response = new ResponseData<>(200,"success",order);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
  @PostMapping("/create-review/{bookId}")
    public ResponseEntity<ResponseData<BookReviewResponse>> createReview(@AuthenticationPrincipal UserDetails userDetails,
                                                                         @Valid @RequestBody CreateReviewRequest createReviewRequest,@PathVariable Integer bookId) {
      BookReviewResponse review = bookReviewService.createReview(createReviewRequest,userDetails.getUsername(),bookId);
      ResponseData<BookReviewResponse> response = new ResponseData<>(200,"success",review);
      return new ResponseEntity<>(response, HttpStatus.OK);
  }
      @GetMapping("/tracking-order")
        public  ResponseEntity<ResponseData<PageResponse<OrderDetailResponse>>> getTrackingOrder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                                  @PageableDefault(page = 0,size = 3,sort ="ngayDat",direction = Sort.Direction.DESC)
                                                                                  Pageable pageable){
        PageResponse<OrderDetailResponse> trackingOrder = orderService.getTrackingOrder(userDetails.getUser().getIdKhachHang(),pageable);
        ResponseData<PageResponse<OrderDetailResponse>> responseData =  new ResponseData<>(200,"success",trackingOrder);
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }
    @GetMapping("/get-cart")
    public ResponseEntity<ResponseData<CartResponse>> getCart (@AuthenticationPrincipal CustomUserDetails userDetails){
      CartResponse cart = cartService.getCart(userDetails.getUser().getIdKhachHang());
      ResponseData<CartResponse> responseData = new ResponseData<>(200,"success",cart);
      return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @PostMapping("/cart-add/{bookId}")
    public ResponseEntity<ResponseData<CartItemResponse>> addItem(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody CartItemRequest cartItemRequest,
                                                                  @PathVariable Integer bookId) {
      CartItemResponse cart = cartItemService.addItem(cartItemRequest,userDetails.getUsername(),bookId);
      ResponseData<CartItemResponse> responseData = new ResponseData<>(200,"success",cart);
      return new ResponseEntity<>(responseData, HttpStatus.OK);
    }





}
