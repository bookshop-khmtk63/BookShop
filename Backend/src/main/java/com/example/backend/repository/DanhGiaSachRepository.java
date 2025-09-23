package com.example.backend.repository;

import com.example.backend.model.DanhGiaSach;
import com.example.backend.model.KhachHang;
import com.example.backend.model.Sach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DanhGiaSachRepository extends JpaRepository<DanhGiaSach, Integer> {
    List<DanhGiaSach> findBySach(Sach randomSach);

    boolean existsByKhachHangAndSach(KhachHang randomKhachHang, Sach randomSach);
}