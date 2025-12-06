package com.example.backend.mapper;

import com.example.backend.dto.response.OrderDetailResponse;
import com.example.backend.dto.response.OrderItemResponse;
import com.example.backend.dto.response.OrderResponse;
import com.example.backend.model.DonHang;
import com.example.backend.model.DonHangChiTiet;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {
    public OrderResponse toOrderResponse(DonHang order) {
        if (order == null) {
            return null;
        }
        int totalItem = (order.getChiTietDonHang()==null)? 0 : order.getChiTietDonHang().stream()
                .mapToInt(DonHangChiTiet::getSoLuong).reduce(0, Integer::sum);
        return OrderResponse.builder()
                .idOrderDetail(order.getIdDonHang())
                .totalPrice(order.getTongTien())
                .quantity(totalItem)
                .status(order.getTrangThai())
                .orderDate(LocalDateTime.ofInstant(order.getNgayDat(), ZoneId.of("Asia/Ho_Chi_Minh")))
                .build();
    }
    public OrderItemResponse toOrderItemResponse(DonHangChiTiet orderItem) {
        if (orderItem == null) {
            return null;
        }
        return OrderItemResponse.builder()
                .orderDetailId(orderItem.getId())
                .bookId(orderItem.getSach().getIdSach())
                .quantity(orderItem.getSoLuong())
                .bookName(orderItem.getSach().getTenSach())
                .thumbnail(orderItem.getSach().getAnhSach())
                .unitPrice(orderItem.getGia())
                .linePrice(orderItem.getGia().multiply(new BigDecimal(orderItem.getSoLuong())))
                .build();
    }
    public OrderDetailResponse toOrderDetailResponse(DonHang order) {
        if (order == null) {
            return null;
        }
        List<OrderItemResponse> item = (order.getChiTietDonHang()==null)? Collections.emptyList()
                :order.getChiTietDonHang().stream().map(this::toOrderItemResponse).toList();
        return OrderDetailResponse.builder()
                .idOrder(order.getIdDonHang())
                .idCustomer(order.getKhachHang().getIdKhachHang())
                .totalPrice(order.getTongTien())
                .status(order.getTrangThai())
                .address(order.getDiaChiGiaoHang())
                .items(item)
                .build();
    }
}
