package com.example.backend.service;

import com.example.backend.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAllCategory();
}
