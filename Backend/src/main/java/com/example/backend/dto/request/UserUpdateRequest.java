package com.example.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserUpdateRequest {
    @NotBlank
    private String fullName;
    @Pattern(regexp = "\\d{10}",message = "OTP phải gồm đúng 6 chữ số")
    private String phone;
    @Email
    private String email;
    @NotBlank
    private String address;
}
