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
public class OrderResponse {
    private Integer idOrderDetail;
    private LocalDateTime orderDate;
    private Integer quantity;
    private TrangThaiDonHang status;
    private BigDecimal totalPrice;
}
