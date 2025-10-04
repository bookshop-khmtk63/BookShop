package com.example.backend.mapper;

import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.model.TheLoai;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {
    public CategoryResponse toCategoryResponse(TheLoai category) {
        if (category == null) {
            return null;
        }
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getTenTheLoai())
                .build();
    }
    public List<CategoryResponse> toCategoryResponseList(List<TheLoai> categories) {
        if (categories == null) {
            return Collections.emptyList();
        }
        return categories.stream().map(this::toCategoryResponse).toList();

    }
}
