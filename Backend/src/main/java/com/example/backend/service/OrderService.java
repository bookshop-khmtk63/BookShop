package com.example.backend.service;

import com.example.backend.dto.response.BookReviewResponse;
import com.example.backend.dto.response.OrderDetailResponse;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.model.DonHang;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    PageResponse<OrderDetailResponse> getAllOrder(Integer idKhachHang, Pageable pageable);

    PageResponse<OrderDetailResponse> getTrackingOrder(Integer idKhachHang, Pageable pageable);

    void saveOrder(DonHang order);
}
