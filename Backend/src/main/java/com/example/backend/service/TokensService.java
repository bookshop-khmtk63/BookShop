package com.example.backend.service;

import aj.org.objectweb.asm.commons.Remapper;
import com.example.backend.common.TokenType;
import com.example.backend.model.CustomUserDetails;
import com.example.backend.model.KhachHang;
import com.example.backend.model.Tokens;

import java.util.Optional;

public interface TokensService {
    Tokens createRefreshToken(CustomUserDetails username);

    void deleteByToken(String tokens);
    void deleteRefreshToken(String refreshTokenString);
    void createVerificationTokenForUser(String token, KhachHang customer);

    Tokens getToken(String token);
     Tokens validateAndGetToken(String tokenString, TokenType tokenType);

    Optional<Tokens> finByToken(String refreshToken);

    void createOtpToken(String token, KhachHang customer);

    void createRestToken(KhachHang user, String token);
}
