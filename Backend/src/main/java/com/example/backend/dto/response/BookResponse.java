package com.example.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookResponse {
    private Integer id;
    private String nameBook;

    private BigDecimal price;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "0.0")
    private double averageRating;
    private String thumbnail;
}
