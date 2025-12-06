package com.example.backend.repository;

import com.example.backend.model.Book;
import com.example.backend.model.GioHang;
import com.example.backend.model.GioHangChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GioHangChiTietRepository extends JpaRepository<GioHangChiTiet, Integer> {

    GioHangChiTiet findByGioHangAndSach(GioHang gioHang, Book sach);


    @Modifying
    @Query("""
Delete from GioHangChiTiet ghct
where ghct.gioHang.khachHang.idKhachHang = :idKhachHang and ghct.id in :cartItemIds
""")
    int deleteByIdsAndCustomerId(@Param("cartItemIds") List<Integer> cartItemIds,@Param("idKhachHang") Integer idKhachHang);

    @Query("""
select ghct
from GioHangChiTiet ghct
where ghct.gioHang.khachHang.idKhachHang = :idKhachHang  and ghct.id = :cartItemId
""")
    Optional<GioHangChiTiet> findByIdItemAndIdCustomer(@Param("cartItemId") Integer cartItemId, @Param("idKhachHang") Integer idKhachHang);
}