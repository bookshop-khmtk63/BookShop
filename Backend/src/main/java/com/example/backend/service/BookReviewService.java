package com.example.backend.service;

import com.example.backend.dto.request.CreateReviewRequest;
import com.example.backend.dto.response.BookReviewResponse;
import com.example.backend.dto.response.PageResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;

public interface BookReviewService {
    BookReviewResponse createReview(@Valid CreateReviewRequest createReviewRequest, String idKhachHang,Integer bookId);


}
