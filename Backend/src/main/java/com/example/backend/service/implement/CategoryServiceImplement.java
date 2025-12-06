package com.example.backend.service.implement;

import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.CategoryMapper;
import com.example.backend.model.TheLoai;
import com.example.backend.repository.TheLoaiRepository;
import com.example.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryServiceImplement implements CategoryService {
    private final TheLoaiRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    @Override
    public List<CategoryResponse> getAllCategory() {
       List<TheLoai> categoryRepositoryAll= categoryRepository.findAll();
       return categoryMapper.toCategoryResponseList(categoryRepositoryAll);
    }

    @Override
    public Set<TheLoai> getCategoryById(Set<Integer> idsCategory) {
    Set<TheLoai> category = new HashSet<>(categoryRepository.findAllById(idsCategory));
    if (category.size() != idsCategory.size()) {
        throw new  AppException(ErrorCode.CATEGORY_NOT_FOUND);
    }
         return category;
    }
}
