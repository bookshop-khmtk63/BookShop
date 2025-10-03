package com.example.backend.repository;

import com.example.backend.common.TokenType;
import com.example.backend.model.KhachHang;
import com.example.backend.model.Tokens;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokensRepository extends JpaRepository<Tokens, Long> {
    void deleteByUser(KhachHang user);

    Optional<Tokens> findByToken(String token);

    void deleteByToken(String token);

    void deleteByUserAndType(KhachHang user, TokenType type);

    void deleteByTokenAndType(String token, TokenType type);
}