package com.example.backend.repository;

import com.example.backend.model.TheLoai;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TheLoaiRepository extends JpaRepository<TheLoai, Integer> {
    boolean existsByTenTheLoai(String ten);
}