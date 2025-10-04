package com.example.backend.repository;

import com.example.backend.model.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GioHangRepository extends JpaRepository<GioHang, Integer> {
}