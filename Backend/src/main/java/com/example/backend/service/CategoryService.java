package com.example.backend.service;

import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.model.TheLoai;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.Set;

public interface CategoryService {

    List<CategoryResponse> getAllCategory();

    Set<TheLoai> getCategoryById(@NotEmpty(message = "Sách phải có ít nhất một thể loại") Set<Integer> idsCategory);
}
