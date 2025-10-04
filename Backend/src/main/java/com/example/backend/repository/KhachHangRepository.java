package com.example.backend.repository;

import com.example.backend.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    boolean existsByEmail(String email);

    boolean existsBySoDienThoai(String soDienThoai);

    Optional<KhachHang> findByEmail(String email);
}