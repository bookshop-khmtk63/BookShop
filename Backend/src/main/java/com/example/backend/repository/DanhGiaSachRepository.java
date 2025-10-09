package com.example.backend.repository;

import com.example.backend.model.DanhGiaSach;
import com.example.backend.model.KhachHang;
import com.example.backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DanhGiaSachRepository extends JpaRepository<DanhGiaSach, Integer> {
    List<DanhGiaSach> findBySach(Book randomSach);

    boolean existsByKhachHangAndSach(KhachHang randomKhachHang, Book randomSach);
}