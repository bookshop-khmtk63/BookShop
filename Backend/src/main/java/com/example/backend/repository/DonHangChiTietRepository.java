package com.example.backend.repository;

import com.example.backend.common.TrangThaiDonHang;
import com.example.backend.dto.response.OrderItemResponse;
import com.example.backend.model.DonHangChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DonHangChiTietRepository extends JpaRepository<DonHangChiTiet, Integer> {
  @Query(value = """
select new com.example.backend.dto.response.OrderItemResponse(dhct.donHang.idDonHang,b.idSach,b.tenSach,b.anhSach,dhct.soLuong,b.gia,dhct.gia)
from DonHangChiTiet dhct left join dhct.sach b
where dhct.donHang.idDonHang in :idOrder
""")
  List<OrderItemResponse> findByOderItemByOrderID(@Param("idOrder") List<Integer> idOrder);

  @Query("""
select case when count (dhct.donHang.idDonHang) > 0 then true else false end
from DonHangChiTiet dhct
where dhct.sach.idSach = :idSach and dhct.donHang.trangThai = :trangThaiDonHang and dhct.donHang.khachHang.idKhachHang = :idKhachHang
""")
  boolean hasPurchasedAndReceived(@Param("idKhachHang") Integer idKhachHang,@Param("idSach") Integer idSach,@Param("trangThaiDonHang") TrangThaiDonHang trangThaiDonHang);
}