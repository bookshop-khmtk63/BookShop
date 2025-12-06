package com.example.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookAdminResponse {
    private Integer id;
    private String nameBook;
    private String author;
    private BigDecimal price;
    private Double averageScore;
    private String thumbnail;
}
