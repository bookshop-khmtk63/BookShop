package com.example.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class OrderItemResponse {
    private Integer orderDetailId;

    // Thông tin sản phẩm
    private Integer bookId;
    private String bookName;
    private String thumbnail;

    private int quantity;
    private BigDecimal unitPrice; // Đơn giá tại thời điểm mua
    private BigDecimal linePrice; // Thành tiền (quantity * unitPrice)
}
