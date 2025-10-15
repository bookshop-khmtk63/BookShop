package com.example.backend.repository;

import com.example.backend.common.TrangThaiDonHang;
import com.example.backend.dto.response.OrderDetailResponse;
import com.example.backend.model.DonHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DonHangRepository extends JpaRepository<DonHang, Integer> {

    @Query(value = """ 
   select new com.example.backend.dto.response.OrderDetailResponse(
       dh.idDonHang,
       dh.khachHang.idKhachHang,
       dh.tongTien,
       cast((select sum(ctd.soLuong) from DonHangChiTiet ctd where ctd.donHang.idDonHang=dh.idDonHang) as integer),
       dh.diaChiGiaoHang,
       dh.trangThai
   )
   from DonHang dh
   where dh.khachHang.idKhachHang=:idKhachHang and dh.trangThai IN :trangThaiDonHang
""")
    Page<OrderDetailResponse> findByOderByCustomerIdAndStatus(
            @Param("idKhachHang") Integer idKhachHang,
            Pageable pageable,
            @Param("trangThaiDonHang") List<TrangThaiDonHang> trangThaiDonHang
    );

}
