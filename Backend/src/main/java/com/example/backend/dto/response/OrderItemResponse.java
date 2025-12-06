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
    private boolean isReview = false;
    private int quantity;
    private BigDecimal unitPrice; // Đơn giá tại thời điểm mua
    private BigDecimal linePrice; // Thành tiền (quantity * unitPrice)
    public OrderItemResponse(final Integer orderDetailId, final Integer bookId, final String bookName, final String thumbnail,  final int quantity, final BigDecimal unitPrice, final BigDecimal linePrice) {
        this.orderDetailId = orderDetailId;
        this.bookId = bookId;
        this.bookName = bookName;
        this.thumbnail = thumbnail;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.linePrice = linePrice;
    }
}
