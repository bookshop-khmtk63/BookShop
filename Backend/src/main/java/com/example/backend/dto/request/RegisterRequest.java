package com.example.backend.dto.request;

import lombok.Getter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Getter
public class RegisterRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    private String email;
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8,message = "Mật khẩu phải có ít nhất 8 ký tự")
    @Pattern(  regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
            message = "Mật khẩu phải chứa ít nhất một chữ số, một chữ thường, một chữ hoa, một ký tự đặc biệt và không chứa khoảng trắng.")
    private String password;
    @Size(min = 8,message = "Mật khẩu phải có ít nhất 8 ký tự")
    @Pattern(  regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
            message = "Mật khẩu phải chứa ít nhất một chữ số, một chữ thường, một chữ hoa, một ký tự đặc biệt và không chứa khoảng trắng.")
    private String confirmPassword;

}
