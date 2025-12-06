package com.example.backend.controller;

import com.example.backend.dto.request.*;
import com.example.backend.dto.response.*;
import com.example.backend.exception.AppException;
import com.example.backend.mapper.CustomerMapper;
import com.example.backend.model.KhachHang;
import com.example.backend.service.AuthService;
import com.example.backend.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid; // <-- PHIÊN BẢN ĐÚNG CHO SPRING BOOT 3
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final CustomerService customerService;
    private final CustomerMapper customerMapper;

    @Value("${app.frontend.verification-success-url}")
    private String verificationSuccessUrl;
    @Value("${app.frontend.verification-error-url}")
    private String verificationErrorUrl;

    @PostMapping("/login")
    public ResponseEntity<ResponseData<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        LoginResponse loginResponse = authService.login(loginRequest, response);
        ResponseData<LoginResponse> responseData = new ResponseData<>(200, "success", loginResponse);
        return ResponseEntity.ok(responseData);
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response, HttpServletRequest request) {
        authService.logout(request, response);
        return ResponseEntity.ok("Logout successful");
    }
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseData<CustomerResponse>> getCustomer(@AuthenticationPrincipal UserDetails userDetails) {
        KhachHang customer = customerService.getCustomerByEmail(userDetails.getUsername());
        ResponseData<CustomerResponse> responseData = new ResponseData<>(200,"success",customerMapper.toCustomerResponse(customer));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    //API lấy access-token từ refresh-token được lưu ở cookie
    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@CookieValue(name = "refresh_token") String refreshToken) {
        RefreshTokenResponse refreshTokenResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(refreshTokenResponse);
    }


    //API tạo tài khoản
    @PostMapping("/register")
    public ResponseEntity<ResponseData<UserResponse>> response(@Valid @RequestBody RegisterRequest registerRequest, HttpServletRequest request) {
        UserResponse user = authService.register(registerRequest, request);
        ResponseData<UserResponse> responseData = new ResponseData<>(200, "success", user);
        return ResponseEntity.ok(responseData);
    }

    // API Xác thực tài khoản bằng link url gửi tới gmail
    @GetMapping("/registerConfirmation")
    public RedirectView registerConfirmation(@RequestParam("token") String token) {
        try {
            authService.confirmRegistration(token);
            return new RedirectView(verificationSuccessUrl);
        } catch (AppException e) {
            return new RedirectView(verificationErrorUrl);
        }
    }

    // API gửi lại link  xác thực đến gmail
    @PostMapping("/send-verification")
    public ResponseEntity<ResponseData<String>> resendVerification(@Valid @RequestBody ResendVerificationRequest resendVerificationRequest,HttpServletRequest request) {
        authService.resendVerification(resendVerificationRequest,request);

        ResponseData<String> responseData = new ResponseData<>(200, "Email xác thực đã được gửi lại thành công. Vui lòng kiểm tra hộp thư của bạn.", null);

        return ResponseEntity.ok(responseData);
    }

    // API gửi mã OTP đến gmail khi quên mật khẩu
    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseData<String>> restPassword(@Valid @RequestBody ForgotPassword forgotPassword, HttpServletRequest request) {
        authService.forgotPassword(forgotPassword,request);
        ResponseData<String> responseData = new ResponseData<>(200, "Mã otp đã được gửi thành công . Vui lòng kiểm tra hộp thư của bạn.", null);
        return ResponseEntity.ok(responseData);
    }

    // API tạo reset-token khi verify otp
    @PostMapping("/verify-otp")
    public ResponseEntity<ResponseData<ResetTokenResponse>> resetToken(@Valid @RequestBody VerifyOtpRequest verifyOtpRequest) {
        ResetTokenResponse resetToken = authService.getResetToken(verifyOtpRequest);
        ResponseData<ResetTokenResponse> responseData = new ResponseData<>(200, "OTP hợp lệ", resetToken);
        return ResponseEntity.ok(responseData);
    }

    //API đặt lại mật khẩu
    @PostMapping("/rest-password")
    public ResponseEntity<ResponseData<String>> restPassword(@Valid @RequestBody RestPasswordRequest restPasswordRequest) {
            authService.resetPassword(restPasswordRequest);
            ResponseData<String> responseData = new ResponseData<>(200, "Mật khẩu đã được thay đổi thành công.", null);
            return ResponseEntity.ok(responseData);
    }


}
