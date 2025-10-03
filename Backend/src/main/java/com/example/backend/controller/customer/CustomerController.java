package com.example.backend.controller.customer;

import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.CustomerResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.mapper.CustomerMapper;
import com.example.backend.model.CustomUserDetails;
import com.example.backend.model.KhachHang;
import com.example.backend.service.CustomerService;
import com.example.backend.utils.JwtTokenUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('USER')")
public class CustomerController {
    private final CustomerService customerService;
    private final CustomerMapper customerMapper;

  //API Cập nhật thông tin người dùng
  @PatchMapping("/update-customer")
    public ResponseEntity<ResponseData<CustomerResponse>> updateCustomer(@Valid @RequestBody UserUpdateRequest userUpdateRequest) {
      CustomerResponse customerResponse = customerService.updateCustomer(userUpdateRequest);
      ResponseData<CustomerResponse> responseData = new ResponseData<>(200,"success",customerResponse);
      return new ResponseEntity<>(responseData, HttpStatus.OK);
  }
  @GetMapping("/me")
  public ResponseEntity<ResponseData<CustomerResponse>> getCustomer  ( @AuthenticationPrincipal CustomUserDetails userDetails) {
      KhachHang customer = customerService.getCustomerByEmail(userDetails.getUsername());
      ResponseData<CustomerResponse> responseData = new ResponseData<>(200,"success",customerMapper.toCustomerResponse(customer));
      return new ResponseEntity<>(responseData, HttpStatus.OK);
  }
}
