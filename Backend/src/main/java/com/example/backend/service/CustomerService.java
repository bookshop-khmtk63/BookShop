package com.example.backend.service;

import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.CustomerResponse;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.KhachHang;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;

public interface CustomerService {
    public KhachHang getCustomerByEmail(String email);

    CustomerResponse updateCustomer(@Valid UserUpdateRequest userUpdateRequest);

    CustomerResponse getCustomerByAuthHeader(String authHeader);

    PageResponse<UserResponse> getAllUser(Pageable pageable);

    void lockUser(Integer userId);

    void unLock(Integer userId);
}
