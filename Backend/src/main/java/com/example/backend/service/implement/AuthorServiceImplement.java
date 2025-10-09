package com.example.backend.service.implement;

import com.example.backend.dto.response.AuthorResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.AuthorMapper;
import com.example.backend.model.TacGia;
import com.example.backend.repository.TacGiaRepository;
import com.example.backend.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorServiceImplement implements AuthorService {
    private final TacGiaRepository tacGiaRepository;
    private final AuthorMapper authorMapper;
    @Override
    public TacGia getAuthorById(Integer idAuthor) {
        return tacGiaRepository.findById(idAuthor).orElseThrow(()->new AppException(ErrorCode.AUTHOR_NOT_FOUND));
    }

    @Override
    public List<AuthorResponse> getAllAuthor() {
        return tacGiaRepository.findAllAuthor();
    }
}
