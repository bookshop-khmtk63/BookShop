package com.example.backend.service;

import com.example.backend.dto.request.CartItemRequest;
import com.example.backend.dto.response.CartItemResponse;
import com.example.backend.dto.response.CartResponse;
import com.example.backend.model.GioHangChiTiet;

import java.util.List;
import java.util.Set;

public interface CartItemService {
    CartItemResponse addItem(CartItemRequest cartItemRequest, String userName,Integer bookId);

    int deleteItem(String username, List<Integer> cartItemIds);

    CartResponse updateCartItem(String username, Integer cartItemId,CartItemRequest cartItemRequest);

    void deleteAllItem(Integer username, List<Integer> idCartItem);
}
