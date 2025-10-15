package com.example.backend.mapper;

import com.example.backend.dto.response.BookReviewResponse;
import com.example.backend.model.DanhGiaSach;
import com.example.backend.model.Book;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
                .timestamp(LocalDateTime.ofInstant(review.getNgayDanhGia(), ZoneId.of("Asia/Ho_Chi_Minh")))
                .comment(review.getBinhLuan())
                .fullName(review.getKhachHang().getHoTen())
                .userId(review.getKhachHang().getIdKhachHang())
                .build();
    }

    public Set<BookReviewResponse> BookReviews(Book sach) {
        if (sach == null) {
            return null;
        }
        return sach.getDanhGias().stream().map(this::toBookReview).collect(Collectors.toSet());
    }
}
