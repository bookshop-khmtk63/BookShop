package com.example.backend.mapper;

import com.example.backend.dto.response.BookDetailResponse;
import com.example.backend.dto.response.BookResponse;
import com.example.backend.dto.response.CategoryResponse;
//import com.example.backend.model.BookElasticsearch;
import com.example.backend.model.DanhGiaSach;
import com.example.backend.model.Sach;
import com.example.backend.model.TheLoai;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.awt.print.Book;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BookMapper {
    private final CategoryMapper categoryMapper;
    public BookDetailResponse toBookDetailResponse(Sach book) {
        if (book == null) return null;

        return BookDetailResponse.builder()
                .id(book.getIdSach())
                .nameBook(book.getTenSach())
                .price(book.getGia())
                .describe(book.getMoTa())
                .category(getCategoryNames(book))
                .averageRating(averageRating(book.getDanhGias()))
                .number(book.getSoLuong())
                .build();
    }



    public BookResponse toBookResponse(Sach book) {
        if (book == null) return null;
        return BookResponse.builder()
                .nameBook(book.getTenSach())
                .id(book.getIdSach())
                .averageRating(averageRating(book.getDanhGias()))
                .price(book.getGia())
                .thumbnail(book.getAnhSach())
                .build();
    }

//    public BookElasticsearch toBookElasticsearch(Sach book) {
//        if (book == null) return null;
//        Set<String> categoryNames = (book.getDanhSachTheLoai() == null) ? Collections.emptySet() :
//                book.getDanhSachTheLoai().stream()
//                        .map(TheLoai::getTenTheLoai)
//                        .collect(Collectors.toSet());
//            return BookElasticsearch.builder()
//                    .id(book.getIdSach().toString())
//                    .tenSach(book.getTenSach())
//                    .gia(book.getGia())
//                    .moTa(book.getMoTa())
//                    .diemTrungBinh(averageRating(book.getDanhGias()))
//                    .soLuong(book.getSoLuong())
//                    .anhSach(book.getAnhSach())
//                    .danhSachTheLoai(categoryNames)
//                    .build();
//    }

    public List<BookResponse> toBookResponseList (List<Sach> books) {
        if (books == null) return Collections.emptyList();
        return books.stream().map(this::toBookResponse).collect(Collectors.toList());
    }

    private Double averageRating(Set<DanhGiaSach> reviews){
        if (reviews == null || reviews.isEmpty()) return 0.0;
        return reviews.stream().mapToInt(DanhGiaSach::getDiemXepHang).average().orElse(0.0);
    }
    private Set<CategoryResponse> getCategoryNames(Sach book) {
        return book.getDanhSachTheLoai()==null ? Collections.emptySet() :
                book.getDanhSachTheLoai().stream().map(categoryMapper::toCategoryResponse).collect(Collectors.toSet());
    }
}
