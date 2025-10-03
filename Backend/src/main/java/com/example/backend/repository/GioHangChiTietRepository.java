package com.example.backend.repository;

import com.example.backend.model.GioHangChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GioHangChiTietRepository extends JpaRepository<GioHangChiTiet, Integer> {
  }