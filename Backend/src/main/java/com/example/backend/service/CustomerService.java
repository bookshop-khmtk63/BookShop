package com.example.backend.service;

import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.CustomerResponse;
import com.example.backend.model.KhachHang;
import jakarta.validation.Valid;

public interface CustomerService {
    public KhachHang getCustomerByEmail(String email);

    CustomerResponse updateCustomer(@Valid UserUpdateRequest userUpdateRequest);
}
