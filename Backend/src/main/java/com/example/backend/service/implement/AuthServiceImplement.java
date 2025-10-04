package com.example.backend.service.implement;

import com.example.backend.common.EventSendToEmail;
import com.example.backend.common.Role;
import com.example.backend.common.TokenType;
import com.example.backend.dto.request.*;
import com.example.backend.dto.response.LoginResponse;
import com.example.backend.dto.response.RefreshTokenResponse;
import com.example.backend.dto.response.ResetTokenResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.event.UserRegisterEvent;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.CustomerMapper;
import com.example.backend.model.CustomUserDetails;
import com.example.backend.model.KhachHang;
import com.example.backend.model.Tokens;
import com.example.backend.repository.KhachHangRepository;
import com.example.backend.repository.TokensRepository;
import com.example.backend.service.AuthService;
import com.example.backend.service.CustomerService;
import com.example.backend.service.RedisService;
import com.example.backend.service.TokensService;
import com.example.backend.service.event.EmailNotificationService;
import com.example.backend.utils.JwtTokenUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImplement implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtils jwtTokenUtils;
    private final TokensService tokensService;
    private final RedisService redisService;
    private final KhachHangRepository khachHangRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailNotificationService emailNotificationService;
    private final CustomerMapper customerMapper;
    private final CustomerService customerService;

    @Value("${jwt.refresh-token.expiration}")
    private Long refreshTokenExpiration;
    @Value("${jwt.refresh-token.cookie-name}")
    private String refreshTokenCookieName;
    @Override
    // Trong AuthServiceImplement.java
    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        log.info("Bắt đầu đăng nhập cho user: {}", loginRequest.getEmail());

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (LockedException e) {
            log.warn("Đăng nhập thất bại cho '{}': Tài khoản đã bị khóa.", loginRequest.getEmail());
            throw new AppException(ErrorCode.USER_LOCKER);
        } catch (DisabledException e) {
            log.warn("Đăng nhập thất bại cho '{}': Tài khoản chưa được kích hoạt.", loginRequest.getEmail());
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        } catch (BadCredentialsException e) {
            log.warn("Đăng nhập thất bại cho '{}': Sai thông tin đăng nhập.", loginRequest.getEmail());
            throw new AppException(ErrorCode.BAD_CREDENTIALS);
        }

        log.info("Xác thực thành công cho user '{}'", loginRequest.getEmail());

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String accessToken = jwtTokenUtils.generateToken(userDetails);
        Tokens tokens = tokensService.createRefreshToken(userDetails);
        addRefreshTokenCookie(response, tokens.getToken());

        return new LoginResponse(accessToken, userDetails.getUsername(), userDetails.getUser().getRole());
    }
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String authHarder = request.getHeader("Authorization");
        if(authHarder!=null && !authHarder.isBlank() && authHarder.startsWith("Bearer ")) {
            String token = authHarder.substring(7);
            if (jwtTokenUtils.getRemainingExpiration(token) > 0) {
                redisService.saveToken(token, jwtTokenUtils.getRemainingExpiration(token));
            }
        }
            Optional.ofNullable(getRefreshTokenFromCookie(request)).ifPresent(tokensService::deleteRefreshToken);
            deleteRefreshTokenCookie(response);

            SecurityContextHolder.clearContext();

        }


        // Tạo tài khoản
    @Override
    @Transactional
    public UserResponse register(RegisterRequest registerRequest, HttpServletRequest request) {
        if(khachHangRepository.existsByEmail(registerRequest.getEmail())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXIST);
        }

        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_CONFIRMATION_MISMATCH);
        }
        KhachHang user = new KhachHang();
        user.setEmail(registerRequest.getEmail());
        user.setHoTen(registerRequest.getEmail());
        user.setMatKhau(passwordEncoder.encode(registerRequest.getPassword()));
        user.setNgayDangKy(Instant.now());
        user.setRole(Role.USER);
        user.setActive(false);
        khachHangRepository.save(user);
        String appUrl = getAppUrl(request);
        String token = UUID.randomUUID().toString();
        UserRegisterEvent userRegisterEvent = UserRegisterEvent.builder()
                .eventName(EventSendToEmail.VERIFY)
                .email(user.getEmail())
                .userId(user.getIdKhachHang())
                .token(token)
                .appUrl(appUrl)
                .build();
        emailNotificationService.sendToGmail(userRegisterEvent);
    return customerMapper.toUserResponse(user);
    }

    private String getAppUrl(HttpServletRequest request) {
        return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    }

    // Xác thực tài khoản bằng link url gửi tới gmail
    @Override
    @Transactional
    public void confirmRegistration(String token) {
        log.info("bat dau: {}", token);
        Tokens tokens = tokensService.validateAndGetToken(token, TokenType.VERIFY);
        KhachHang  user = tokens.getUser();
        user.setActive(true);
        tokens.setUsed(true);
        khachHangRepository.save(user);
        log.info("ket thúc : {}", user);
    }


    //Lấy accset-token bằng
    @Override
    public RefreshTokenResponse refreshToken(String refreshToken) {
        return tokensService.finByToken(refreshToken)
                .map(refresh -> tokensService.validateAndGetToken(refresh.getToken(),TokenType.REFRESH))
                .map(Tokens::getUser)
                .map(user -> {
                    UserDetails userDetails = new CustomUserDetails(user);


                    String accessToken = jwtTokenUtils.generateToken(userDetails);

                    return new RefreshTokenResponse(accessToken);
                }).orElseThrow(()->new AppException(ErrorCode.REFRESHTOKEN_EXPIRED));
    }

    @Override
    public void resendVerification(ResendVerificationRequest resendVerificationRequest, HttpServletRequest request) {
        log.info("Gửi lại mã xác thức tới gmail {}", resendVerificationRequest.getEmail());
        KhachHang user = customerService.getCustomerByEmail(resendVerificationRequest.getEmail());
        if (user.isActive()) {
            throw new AppException(ErrorCode.USER_ALREADY_ACTIVATED);
        }
        String token = UUID.randomUUID().toString();

        String appUrl = getAppUrl(request);
        UserRegisterEvent userRegisterEvent = UserRegisterEvent.builder()
                .eventName(EventSendToEmail.VERIFY)
                .email(user.getEmail())
                .userId(user.getIdKhachHang())
                .token(token)
                .appUrl(appUrl)
                .build();
        emailNotificationService.sendToGmail(userRegisterEvent);
        log.info("Đã gửi lại email xác thực thành công cho: {}", resendVerificationRequest.getEmail());
    }

    @Override

    public void forgotPassword(ForgotPassword forgotPassword, HttpServletRequest request) {
        log.info("Gửi lại mã otp tới gmail {}", forgotPassword.getEmail());
        KhachHang user = customerService.getCustomerByEmail(forgotPassword.getEmail());
        SecureRandom random = new SecureRandom();
        int token = 100000 + random.nextInt(900000);
        String otp = String.valueOf(token);
        String appUrl = getAppUrl(request);
        UserRegisterEvent userRegisterEvent = UserRegisterEvent.builder()
                .eventName(EventSendToEmail.RESET)
                .email(user.getEmail())
                .userId(user.getIdKhachHang())
                .token(otp)
                .appUrl(appUrl)
                .build();
        emailNotificationService.sendToGmail(userRegisterEvent);
        log.info("Đã gửi lại mã otp xác thực thành công đến email : {}", forgotPassword.getEmail());

    }

    @Override
    public ResetTokenResponse getResetToken(VerifyOtpRequest verifyOtpRequest) {
        log.info("Xác thực ");
        KhachHang user = customerService.getCustomerByEmail(verifyOtpRequest.getEmail());
        Tokens otp = tokensService.validateAndGetToken(verifyOtpRequest.getOtp(),TokenType.RESET);
        otp.setUsed(true);
        String token = UUID.randomUUID().toString();
         tokensService.createRestToken(user,token);
         return ResetTokenResponse.builder()
                 .reset_token(token).build();
    }

    @Override
    @Transactional
    public void resetPassword(RestPasswordRequest restPasswordRequest) {
        Tokens resetToken = tokensService.validateAndGetToken(restPasswordRequest.getResetToken(),TokenType.PASSWORD_RESET);
        if (!restPasswordRequest.getPassword().equals(restPasswordRequest.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_CONFIRMATION_MISMATCH);
        }
        KhachHang customer = resetToken.getUser();
        customer.setMatKhau(passwordEncoder.encode(restPasswordRequest.getPassword()));
        resetToken.setUsed(true);

    }
//      Trên cùng một serve
//    private void deleteRefreshTokenCookie(HttpServletResponse response) {
//        Cookie refreshTokenCookie = new Cookie(refreshTokenCookieName, null);
//        refreshTokenCookie.setPath("/");
//        refreshTokenCookie.setMaxAge(0);
//        refreshTokenCookie.setHttpOnly(true);
//        refreshTokenCookie.setSecure(true);
//        response.addCookie(refreshTokenCookie);
//    }
private void deleteRefreshTokenCookie(HttpServletResponse response) {
    ResponseCookie refreshTokenCookie = ResponseCookie.from(refreshTokenCookieName, "") // Giá trị rỗng
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(0) // Đặt thời gian sống bằng 0 để xóa
            .sameSite("None") // QUAN TRỌNG: Phải khớp với cookie lúc tạo
            .build();

    response.addHeader("Set-Cookie", refreshTokenCookie.toString());
}

    private String getRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if(cookies!=null) {
            for (Cookie cookie : cookies) {
                if(refreshTokenCookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
// Trên cùng một serve
//    private void addRefreshTokenCookie(HttpServletResponse response, String token) {
//        Cookie refreshTokenCookie = new Cookie(refreshTokenCookieName, token);
//        refreshTokenCookie.setHttpOnly(true);
//        refreshTokenCookie.setSecure(true);
//
//        refreshTokenCookie.setPath("/");
//        refreshTokenCookie.setMaxAge((int) (refreshTokenExpiration / 1000));
//        response.addCookie(refreshTokenCookie);
//    }
private void addRefreshTokenCookie(HttpServletResponse response, String token) {
    ResponseCookie refreshTokenCookie = ResponseCookie.from(refreshTokenCookieName, token)
            .httpOnly(true)
            .secure(true)// SameSite=None yêu cầu kết nối an toàn (HTTPS)
            .path("/")
            .maxAge(refreshTokenExpiration / 1000)
            .sameSite("None") // Cho phép cookie được gửi từ domain của FE sang domain của BE
            .build();
    response.addHeader("Set-Cookie", refreshTokenCookie.toString());
}
}
