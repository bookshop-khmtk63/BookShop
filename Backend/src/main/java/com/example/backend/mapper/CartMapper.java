package com.example.backend.mapper;

import com.example.backend.dto.response.CartItemResponse;
import com.example.backend.dto.response.CartResponse;
import com.example.backend.model.GioHang;
import com.example.backend.model.GioHangChiTiet;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CartMapper {
    public CartItemResponse toCartItemResponse(GioHangChiTiet cartItem) {
        if (cartItem == null) {
            return null;
        }
        return CartItemResponse.builder()
                .idBook(cartItem.getSach().getIdSach())
                .idCartItem(cartItem.getId())
                .quantity(cartItem.getSoLuong())
                .nameBook(cartItem.getSach().getTenSach())
                .totalPrice(totalPrice(cartItem))
                .price(cartItem.getSach().getGia())
                .thumbnail(cartItem.getSach().getAnhSach())
                .build();

    }


    public List<CartItemResponse> toCartItemResponseList(List<GioHangChiTiet> cartItems) {
        if (cartItems == null || cartItems.isEmpty()) {
            return null;
        }
        return cartItems.stream().map(this::toCartItemResponse).collect(Collectors.toList());
    }


    public CartResponse toCartResponse(GioHang cart) {
        if (cart == null) {
            return null;
        }
        List<CartItemResponse> cartItemResponseSet = (cart.getChiTietGioHang()==null)? Collections.emptyList():
                cart.getChiTietGioHang().stream().map(this::toCartItemResponse).collect(Collectors.toList());
        BigDecimal totalPrice =totalPriceCart(cartItemResponseSet);
        int totalItems = totalQuantity(cartItemResponseSet);
        return CartResponse.builder()
                .idCart(cart.getIdGioHang())
                .idCustomer(cart.getKhachHang().getIdKhachHang())
                .totalPrice(totalPrice)
                .totalQuantity(totalItems)
                .items(cartItemResponseSet)
                .build();
    }


    private BigDecimal totalPrice(GioHangChiTiet cartItem) {
        if(cartItem == null) {
            return BigDecimal.ZERO;
        }
        return cartItem.getSach().getGia().multiply(new BigDecimal(cartItem.getSoLuong()));
    }
    private BigDecimal totalPriceCart(List<CartItemResponse> cartItems) {
        if(cartItems == null ) {
            return BigDecimal.ZERO;
        }
        return cartItems.stream().map(CartItemResponse::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    private int totalQuantity(List<CartItemResponse> cartItems) {
        if(cartItems == null ) {
            return 0;
        }
        return cartItems.stream().map(CartItemResponse::getQuantity).reduce(0, Integer::sum);
    }
}
