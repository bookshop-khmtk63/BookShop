package com.example.backend.dto.response;

import com.example.backend.model.TheLoai;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookDetailResponse {
    private Integer id;
    private String nameBook;
    private BigDecimal price;
    private String describe;
    private int number;
    private Set<CategoryResponse> category;
    private double averageRating;
    private Set<BookReviewResponse> reviews;
}
