package com.example.backend.service;

import com.example.backend.dto.request.*;
import com.example.backend.dto.response.LoginResponse;
import com.example.backend.dto.response.RefreshTokenResponse;
import com.example.backend.dto.response.ResetTokenResponse;
import com.example.backend.dto.response.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest, HttpServletResponse response);

    void logout(HttpServletRequest request, HttpServletResponse response);

    UserResponse register(RegisterRequest registerRequest, HttpServletRequest request);

    void confirmRegistration(String token);

    RefreshTokenResponse refreshToken(String refreshToken);

    void resendVerification(@Valid ResendVerificationRequest resendVerificationRequest,HttpServletRequest request );

    void forgotPassword(@Valid ForgotPassword forgotPassword, HttpServletRequest request);

    ResetTokenResponse getResetToken(@Valid VerifyOtpRequest verifyOtpRequest);

    void resetPassword(@Valid RestPasswordRequest restPasswordRequest);
}
