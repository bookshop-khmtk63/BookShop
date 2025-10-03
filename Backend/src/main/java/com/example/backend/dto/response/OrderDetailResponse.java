package com.example.backend.dto.response;

import com.example.backend.common.TrangThaiDonHang;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailResponse {
    private Integer idOrder;
    private Integer idCustomer;
    private LocalDateTime orderDate;
    private BigDecimal totalPrice;
    private String address;
    private TrangThaiDonHang status;
    private List<OrderItemResponse> items;
}
