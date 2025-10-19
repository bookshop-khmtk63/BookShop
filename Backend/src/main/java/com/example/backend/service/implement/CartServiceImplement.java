package com.example.backend.service.implement;

import com.example.backend.dto.response.CartResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.CartMapper;
import com.example.backend.model.GioHang;
import com.example.backend.model.KhachHang;
import com.example.backend.repository.GioHangRepository;
import com.example.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImplement implements CartService {
    private final GioHangRepository cartRepository;
    private final CartMapper cartMapper;
    @Override
    public CartResponse getCart(Integer idCustomer) {
        GioHang cart = cartRepository.findByCustomerIdWithDetails(idCustomer).
                orElseThrow(()->new AppException(ErrorCode.CART_NOT_FOUND));
        return cartMapper.toCartResponse(cart);
    }


    @Override
    public GioHang getCartById(Integer idKhachHang) {
        return cartRepository.findByCustomerIdWithDetails(idKhachHang).
                orElseThrow(()->new AppException(ErrorCode.CART_NOT_FOUND));
    }

    @Override
    public Optional<GioHang> getCartOrCreateCart(Integer idKhachHang) {

        return cartRepository.findByKhachHang_IdKhachHang(idKhachHang);
    }

    @Override
    public GioHang addCart(KhachHang customer) {
        GioHang newCart = GioHang.builder()
                .khachHang(customer) // Phải gán KhachHang khi tạo giỏ hàng
                .build();
        return cartRepository.save(newCart); // LƯU giỏ hàng để có ID
    }


}
