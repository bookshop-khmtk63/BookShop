package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataPoint {
    private String label;      // Nhãn cho trục X (e.g., "2025-10-21", "Tháng 10")
    private BigDecimal value;  // Giá trị cho trục Y (doanh thu của ngày/tháng đó)
}
