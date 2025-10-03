package com.example.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartResponse {
    private Integer idCart;
    private Integer idCustomer;
    private BigDecimal totalPrice;
    private Set<CartItemResponse> items;
    private int totalQuantity;
}
