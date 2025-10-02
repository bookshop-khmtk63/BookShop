package com.example.backend.mapper;

import com.example.backend.dto.response.BookReviewResponse;
import com.example.backend.model.DanhGiaSach;
import com.example.backend.model.Sach;
import com.example.backend.model.TheLoai;
import org.springframework.stereotype.Component;

import java.awt.print.Book;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class BookReviewMapper {
    public BookReviewResponse toBookReview(DanhGiaSach review) {
        if (review == null) {
            return null;
        }
        return BookReviewResponse.builder()
                .id(review.getIdDanhGia())
                .rating(review.getDiemXepHang())
                .timestamp(review.getNgayDanhGia())
                .comment(review.getBinhLuan())
                .fullName(review.getKhachHang().getHoTen())
                .userId(review.getKhachHang().getIdKhachHang())
                .build();
    }

    public Set<BookReviewResponse> BookReviews(Sach sach) {
        if (sach == null) {
            return null;
        }
        return sach.getDanhGias().stream().map(this::toBookReview).collect(Collectors.toSet());
    }
}
