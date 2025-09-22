package com.example.backend.repository;

import com.example.backend.model.Sach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SachRepository extends JpaRepository<Sach, Integer>, JpaSpecificationExecutor<Sach> {
}