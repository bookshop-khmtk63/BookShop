package com.example.backend.service;

import com.example.backend.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(Integer idKhachHang);
}
