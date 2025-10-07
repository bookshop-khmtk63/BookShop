package com.example.backend.service.implement;

import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.model.TacGia;
import com.example.backend.repository.TacGiaRepository;
import com.example.backend.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorServiceImplement implements AuthorService {
    private final TacGiaRepository tacGiaRepository;

    @Override
    public TacGia getAuthorById(Integer idAuthor) {
        return tacGiaRepository.findById(idAuthor).orElseThrow(()->new AppException(ErrorCode.AUTHOR_NOT_FOUND));
    }
}
