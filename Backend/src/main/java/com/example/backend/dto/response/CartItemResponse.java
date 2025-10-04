package com.example.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemResponse {
    private Integer idBook;
    private Integer idCartItem;
    private String nameBook;
    private String thumbnail;
    private BigDecimal totalPrice;
    private BigDecimal price;
    private Integer quantity;
}
