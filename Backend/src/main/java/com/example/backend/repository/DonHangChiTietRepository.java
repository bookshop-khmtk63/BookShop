package com.example.backend.repository;

import com.example.backend.model.DonHangChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonHangChiTietRepository extends JpaRepository<DonHangChiTiet, Integer> {
  }