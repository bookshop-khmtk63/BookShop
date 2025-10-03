package com.example.backend.repository;

import com.example.backend.model.Sach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SachRepository extends JpaRepository<Sach, Integer>, JpaSpecificationExecutor<Sach> {
    @Query("SELECT s FROM Sach s " +
            "JOIN s.tacGia tg " +
            "WHERE lower(tg.tenTacGia) LIKE lower(concat('%', :keyword, '%'))" +
                "or lower(s.tenSach) like lower(concat('%', :keyword, '%') ) ")
    Page<Sach> searchByKeyWord(@Param("keyword") String keyword, Pageable pageable);
}