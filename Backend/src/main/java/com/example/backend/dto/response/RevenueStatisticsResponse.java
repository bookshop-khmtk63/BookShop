package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.util.List;
@Data
@Builder
public class RevenueStatisticsResponse {
    private BigDecimal totalRevenue;      // Tổng doanh thu trong cả khoảng thời gian
    private long totalOrders;             // Tổng số đơn hàng thành công
    private List<DataPoint> revenueOverTime;  // Dữ liệu để vẽ biểu đồ
}
