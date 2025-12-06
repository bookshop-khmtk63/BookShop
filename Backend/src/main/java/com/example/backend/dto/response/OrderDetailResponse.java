package com.example.backend.dto.response;

import com.example.backend.common.TrangThaiDonHang;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class OrderDetailResponse {
    private Integer idOrder;
    private Integer idCustomer;
    private BigDecimal totalPrice;
    private Integer  amount;
    private String address;
    private TrangThaiDonHang status;
    private List<OrderItemResponse> items;
    public OrderDetailResponse(
            Integer idOrder,
            Integer idCustomer,
            BigDecimal totalPrice,
            Integer  amount, // SUM(int) trả về Long
            String address,
            TrangThaiDonHang status
    ) {
        this.idOrder = idOrder;
        this.idCustomer = idCustomer;
        this.totalPrice = totalPrice;
        this.amount = amount;
        this.address = address;
        this.status = status;
        this.items = new java.util.ArrayList<>(); // Hoặc new ArrayList<>();
    }
}
