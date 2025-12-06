package com.example.backend.dto.request;

import com.example.backend.common.TrangThaiDonHang;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UpdateOrderStatusRequest {
    @NotNull(message = "Trạng thái mới không được để trống")
    private TrangThaiDonHang newStatus;
}
