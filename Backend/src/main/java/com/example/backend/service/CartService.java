package com.example.backend.service;

import com.example.backend.dto.request.CartItemRequest;
import com.example.backend.dto.response.CartItemResponse;
import com.example.backend.dto.response.CartResponse;
import com.example.backend.dto.response.OrderDetailResponse;
import com.example.backend.model.GioHang;
import com.example.backend.model.KhachHang;

import java.util.Optional;

public interface CartService {
    CartResponse getCart(Integer idKhachHang);


    GioHang getCartById(Integer idKhachHang);

    Optional<GioHang> getCartOrCreateCart(Integer idKhachHang);

    GioHang addCart(KhachHang customer);

    OrderDetailResponse payOrder(String username);
}
