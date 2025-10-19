package com.example.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CartItemRequest {
    @NotNull(message = "Không được để trống")
    @Min(value = 1,message = "Số lượng sản phầm phải lớn hơn 0")
    private int quantity;

}
