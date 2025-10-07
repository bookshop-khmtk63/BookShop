package com.example.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
public class UpdateBookRequest {
    @Size(max = 255, message = "Tên sách không được vượt quá 255 ký tự")
    private String nameBook;

    @DecimalMin(value = "0.0",inclusive = false,message = "Số tiền phải lớn hơn 0")
    @Digits(integer = 8,fraction = 2,message = "Số tiền không hơp lệ")
    private BigDecimal price;

    @Min(value = 0, message = "Số lượng không được là số âm")
    private Integer quantity;

    @Size(max = 5000, message = "Mô tả không được quá 5000 ký tự")
    private String description;

    @Min(value = 1, message = "ID tác giả không hợp lệ")
    private Integer idAuthor;

    private Set<Integer> idsCategory;
}
