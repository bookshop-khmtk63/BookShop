package com.example.backend.service;

import com.example.backend.dto.request.CartItemRequest;
import com.example.backend.dto.response.CartItemResponse;

public interface CartItemService {
    CartItemResponse addItem(CartItemRequest cartItemRequest, String userName,Integer bookId);
}
