package com.example.backend.repository;

import com.example.backend.dto.response.AuthorResponse;
import com.example.backend.model.TacGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TacGiaRepository extends JpaRepository<TacGia, Integer> {

     @Query(value = """
select new com.example.backend.dto.response.AuthorResponse(a.id,a.tenTacGia)
from TacGia a""")
    List<AuthorResponse> findAllAuthor();
}