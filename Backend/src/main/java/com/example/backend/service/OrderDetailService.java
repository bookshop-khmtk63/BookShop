package com.example.backend.service;

import com.example.backend.dto.response.OrderItemResponse;

import java.util.List;

public interface OrderDetailService {
    List<OrderItemResponse> findByOderItemByOrderID(List<Integer> idOrder);
}
