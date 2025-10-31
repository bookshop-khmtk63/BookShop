package com.example.backend.repository;

import com.example.backend.common.TrangThaiDonHang;
import com.example.backend.dto.response.OrderDetailResponse;
import com.example.backend.dto.response.SummaryStats;
import com.example.backend.model.DonHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
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
""",countQuery = """
select count(dh.idDonHang) from DonHang dh
""")
    Page<OrderDetailResponse> findByOderByCustomerIdAndStatus(
            @Param("idKhachHang") Integer idKhachHang,
            Pageable pageable,
            @Param("trangThaiDonHang") List<TrangThaiDonHang> trangThaiDonHang
    );


    @Query("""
    SELECT new com.example.backend.dto.response.SummaryStats(
        SUM(dh.tongTien), 
        COUNT(dh.idDonHang)
    )
    FROM DonHang dh
    WHERE dh.trangThai = :status
    AND dh.ngayDat BETWEEN :startDate AND :endDate
""")
    SummaryStats findSummaryStats(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("status") TrangThaiDonHang status
    );

    // Query để lấy doanh thu gom nhóm theo NGÀY (Cú pháp cho MySQL)
    @Query(value = """
        SELECT DATE(ngay_dat) as label, SUM(tong_tien) as value
        FROM don_hang
        WHERE trang_thai = :status AND ngay_dat BETWEEN :startDate AND :endDate
        GROUP BY DATE(ngay_dat)
        ORDER BY label
    """, nativeQuery = true)
    List<Object[]> findRevenueGroupByDay(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("status") String status
    );

    // Query để lấy doanh thu gom nhóm theo THÁNG (Cú pháp cho MySQL)
    @Query(value = """
        SELECT DATE_FORMAT(ngay_dat, '%Y-%m-01') as label, SUM(tong_tien) as value
        FROM don_hang
        WHERE trang_thai = :status AND ngay_dat BETWEEN :startDate AND :endDate
        GROUP BY DATE_FORMAT(ngay_dat, '%Y-%m-01')
        ORDER BY label
    """, nativeQuery = true)
    List<Object[]> findRevenueGroupByMonth(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("status") String status
    );
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
""",countQuery = """
select count(dh.idDonHang) from DonHang dh
""")
    Page<OrderDetailResponse> findByOrder(Pageable pageable);
}
