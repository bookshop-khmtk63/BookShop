package com.example.backend.service.implement;

import com.example.backend.dto.response.CartResponse;
import com.example.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImplement implements CartService {
    @Override
    public CartResponse getCart(Integer idKhachHang) {

        return null;
    }
}
