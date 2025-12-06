package com.example.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
//@AllArgsConstructor
@NoArgsConstructor
public class SummaryStats {
    private BigDecimal totalRevenue;
    private Long totalOrders ;
    public SummaryStats(BigDecimal totalRevenue, Long totalOrders) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
    }
}

