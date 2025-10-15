package com.example.backend.service.implement;

import com.example.backend.common.TrangThaiDonHang;
import com.example.backend.dto.response.OrderItemResponse;
import com.example.backend.repository.DonHangChiTietRepository;
import com.example.backend.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderDetailImplementService implements OrderDetailService {
    private final DonHangChiTietRepository donHangChiTietRepository;
    @Override
    public List<OrderItemResponse> findByOderItemByOrderID(List<Integer> idOrder) {
        return donHangChiTietRepository.findByOderItemByOrderID(idOrder);
    }

    @Override
    public boolean hasPurchasedAndReceived(Integer idKhachHang, Integer idSach, TrangThaiDonHang trangThaiDonHang) {

        return donHangChiTietRepository.hasPurchasedAndReceived(idKhachHang,idSach,trangThaiDonHang);
    }
}
