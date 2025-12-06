package com.example.backend.service;

import com.example.backend.common.TrangThaiDonHang;
import com.example.backend.dto.response.OrderDetailResponse;
import com.example.backend.dto.response.OrderItemResponse;
import com.example.backend.model.DonHangChiTiet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderDetailService {
    List<OrderItemResponse> findByOderItemByOrderID(List<Integer> idOrder);

    boolean hasPurchasedAndReceived(Integer idKhachHang, Integer idSach, TrangThaiDonHang trangThaiDonHang);

    void save(List<DonHangChiTiet> orderDetail);


}
