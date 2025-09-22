package com.example.backend.repository;

import com.example.backend.model.Tokens;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokensRepository extends JpaRepository<Tokens, Long> {
}