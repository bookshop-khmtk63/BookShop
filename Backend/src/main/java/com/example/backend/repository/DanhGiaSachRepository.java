package com.example.backend.repository;

import com.example.backend.dto.response.BookReviewResponse;
import com.example.backend.model.DanhGiaSach;
import com.example.backend.model.KhachHang;
import com.example.backend.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface DanhGiaSachRepository extends JpaRepository<DanhGiaSach, Integer> {
    List<DanhGiaSach> findBySach(Book randomSach);

    boolean existsByKhachHangAndSach(KhachHang randomKhachHang, Book randomSach);


    @Query(value = """
select dgs.sach.idSach
from DanhGiaSach dgs
where dgs.khachHang.idKhachHang = :idKhachHang and dgs.sach.idSach IN :bookIds
""")
    Set<Integer> findReviewBookIdAndCustomer(@Param("bookIds") Set<Integer> bookIds,@Param("idKhachHang") Integer idKhachHang);

    @Query(value = """ 
select new com.example.backend.dto.response.BookReviewResponse(dgs.idDanhGia,dgs.diemXepHang,dgs.binhLuan,dgs.ngayDanhGia,dgs.khachHang.idKhachHang,dgs.khachHang.hoTen)
from DanhGiaSach dgs

""", countQuery = """
select count (dgs)
from DanhGiaSach dgs
""")
    Page<BookReviewResponse> findAllReview(Pageable pageable);
}