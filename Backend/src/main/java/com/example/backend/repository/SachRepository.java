package com.example.backend.repository;

import com.example.backend.dto.response.BookAdminResponse;
import com.example.backend.model.Book;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SachRepository extends JpaRepository<Book, Integer>, JpaSpecificationExecutor<Book> {
    @Query("SELECT s FROM Book s " +
            "JOIN s.tacGia tg " +
            "WHERE lower(tg.tenTacGia) LIKE lower(concat('%', :keyword, '%'))" +
                "or lower(s.tenSach) like lower(concat('%', :keyword, '%') ) ")
    Page<Book> searchByKeyWord(@Param("keyword") String keyword, Pageable pageable);


    @Query(value = """
        SELECT new com.example.backend.dto.response.BookAdminResponse(
        s.idSach,
        s.tenSach,
        s.tacGia.tenTacGia,
        s.gia,
        s.diemTrungBinh,
        s.anhSach
    )
    FROM Book s 
    LEFT JOIN s.tacGia tg 
    LEFT JOIN s.danhSachTheLoai dstl 
    GROUP BY s.idSach, s.tenSach, s.tacGia.tenTacGia, s.gia, s.diemTrungBinh, s.anhSach
    """,
            countQuery = """
    SELECT COUNT(s.idSach)
    FROM Book s
    """
    )
    Page<BookAdminResponse> AdminGetAllBooks(Pageable pageable);


    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Book b WHERE b.idSach = :idSach")
    Optional<Book> findByIdForUpdate(@Param("idSach") Integer idSach);
}