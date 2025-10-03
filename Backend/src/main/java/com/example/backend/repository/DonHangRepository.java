package com.example.backend.repository;

import com.example.backend.model.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonHangRepository extends JpaRepository<DonHang, Integer> {
}