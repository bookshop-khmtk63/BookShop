package com.example.backend.service;

import com.example.backend.dto.response.AuthorResponse;
import com.example.backend.model.TacGia;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public interface AuthorService {
    TacGia getAuthorById(@NotNull(message = "Tác giả không được để trống") @Min(value = 1, message = "ID tác giả không hợp lệ") Integer idAuthor);

    List<AuthorResponse> getAllAuthor();
}
