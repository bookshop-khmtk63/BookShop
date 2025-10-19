package com.example.backend.repository;

import com.example.backend.dto.response.CartResponse;
import com.example.backend.model.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GioHangRepository extends JpaRepository<GioHang, Integer> {

    @Query("""
select gh from GioHang gh
left join fetch gh.chiTietGioHang ctgh
left join fetch ctgh.sach b
where gh.khachHang.idKhachHang =:idCustomer
""")
    Optional< GioHang> findByCustomerIdWithDetails(@Param("idCustomer") Integer idCustomer);

    Optional<GioHang> findByKhachHang_IdKhachHang(Integer idKhachHang);
}