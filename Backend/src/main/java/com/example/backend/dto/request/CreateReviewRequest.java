package com.example.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
@Setter
public class CreateReviewRequest {
    @NotNull(message = "Không được để trống đánh giá ")
    @Min(value = 1,message = "Đánh giá lớn hơn 1")
    @Max(value = 5,message = "Đánh giá nhỏ hơn 5 ")
    private Integer rating;
    @NotBlank
    @Size(max = 5000, message = "Bình luận dưới 500 từ ")
    private String comment; // Bình luận có thể là tùy chọn (nullable)
}
