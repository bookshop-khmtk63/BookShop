package com.example.backend.service.implement;

import aj.org.objectweb.asm.commons.Remapper;
import com.example.backend.common.TokenType;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.model.CustomUserDetails;
import com.example.backend.model.KhachHang;
import com.example.backend.model.Tokens;
import com.example.backend.repository.TokensRepository;
import com.example.backend.service.TokensService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokensServiceImplement implements TokensService {
    private final TokensRepository tokensRepository;
    @Value("${jwt.refresh-token.expiration}")
    private Long refreshToken;
    @Value("${app.security.verification-token.expiration-ms}")
    private Long expirationMs;
    @Value("${app.security.otp-token.expiration-ms}")
    private Long otpExpirationMs;

    @Override
    @Transactional
    public Tokens createRefreshToken(CustomUserDetails user) {
        tokensRepository.deleteByUserAndType(user.getUser(), TokenType.REFRESH);
        Tokens tokens = Tokens.builder()
                .user(user.getUser())
                .createdAt(Instant.now())
                .expiryDate(Instant.now().plusMillis(refreshToken))
                .token(UUID.randomUUID().toString())
                .type(TokenType.REFRESH)
                .build();
        tokensRepository.save(tokens);
        return tokens;
    }

    @Override
    @Transactional
    public void deleteByToken(String tokens) {
        tokensRepository.deleteByToken(tokens);
    }

    @Override
    @Transactional
    public void deleteRefreshToken(String refreshTokenString) {
        tokensRepository.findByToken(refreshTokenString).ifPresent(token -> {
            if (token.getType() == TokenType.REFRESH) {
                tokensRepository.delete(token);
                log.info("Đã xóa refresh token thành công.");
            } else {
                log.warn("Cảnh báo bảo mật: Có người đã cố gắng dùng API logout để xóa một token không phải loại REFRESH. Token: {}", refreshTokenString);
            }
        });
    }

    @Override
    @Transactional
    public void createVerificationTokenForUser(String token, KhachHang customer) {
         createToken(customer, token, TokenType.VERIFY, expirationMs);
    }


    @Override
    @Transactional
    public void createOtpToken(String token, KhachHang customer) {
        createToken(customer, token, TokenType.RESET, expirationMs);
    }

    @Override
    @Transactional
    public void createRestToken(KhachHang customer, String token) {
        createToken(customer, token, TokenType.PASSWORD_RESET, expirationMs);
    }

    @Override
    public Tokens getToken(String token) {
        return tokensRepository.findByToken(token).orElseThrow(() -> new AppException(ErrorCode.TOKEN_NOT_FOUND));
    }

    @Override
    public Tokens validateAndGetToken(String tokenString,TokenType tokenType) {
        Tokens token = getToken(tokenString);

        if(token.getType()!=(tokenType)) {
            log.warn("Lỗi bảo mật: Loại token không khớp. Mong đợi {}, thực tế là {}", tokenType, token.getType());
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        if (token.isUsed()) {
            log.warn("Token đã được kịchs hoạt {}",tokenString);
            throw new AppException(ErrorCode.TOKEN_ALREADY_USED);
        }

        if (token.getExpiryDate().isBefore(Instant.now())) {
            log.warn("Token hêt hạn");
            throw new AppException(ErrorCode.REFRESHTOKEN_EXPIRED);
        }

        return token;
    }

    @Override
    public Optional<Tokens> finByToken(String refreshToken) {
        return tokensRepository.findByToken(refreshToken);
    }

    private void createToken(KhachHang customer, String token, TokenType tokenType, Long expirationMs) {
        tokensRepository.deleteByUserAndType(customer, tokenType);

        Tokens tokens = Tokens.builder()
                .token(token)
                .user(customer)
                .createdAt(Instant.now())
                .expiryDate(Instant.now().plusMillis(expirationMs))
                .type(tokenType)
                .build();
        tokensRepository.save(tokens);
    }




}
