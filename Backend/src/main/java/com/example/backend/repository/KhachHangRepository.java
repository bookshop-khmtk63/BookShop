package com.example.backend.repository;

import com.example.backend.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    boolean existsByEmail(String email);

    boolean existsBySoDienThoai(String soDienThoai);
}