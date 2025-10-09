package com.example.backend.mapper;

import com.example.backend.dto.response.BookDetailResponse;
import com.example.backend.dto.response.BookResponse;
import com.example.backend.dto.response.CategoryResponse;
//import com.example.backend.model.BookElasticsearch;
import com.example.backend.model.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BookMapper {
    private final CategoryMapper categoryMapper;
    private final BookReviewMapper bookReviewMapper;
    public BookDetailResponse toBookDetailResponse(Book book) {
        if (book == null) return null;

        return BookDetailResponse.builder()
                .id(book.getIdSach())
                .nameBook(book.getTenSach())
                .price(book.getGia())
                .describe(book.getMoTa())
                .category(getCategoryNames(book))
                .averageRating(book.getDiemTrungBinh())
                .author(book.getTacGia().getTenTacGia())
                .number(book.getSoLuong())
                .reviews(bookReviewMapper.BookReviews(book))
                .build();
    }



    public BookResponse toBookResponse(Book book) {
        if (book == null) return null;
        return BookResponse.builder()
                .nameBook(book.getTenSach())
                .id(book.getIdSach())
                .averageRating(book.getDiemTrungBinh())
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

    public List<BookResponse> toBookResponseList (List<Book> books) {
        if (books == null) return Collections.emptyList();
        return books.stream().map(this::toBookResponse).collect(Collectors.toList());
    }


    private Set<CategoryResponse> getCategoryNames(Book book) {
        return book.getDanhSachTheLoai()==null ? Collections.emptySet() :
                book.getDanhSachTheLoai().stream().map(categoryMapper::toCategoryResponse).collect(Collectors.toSet());
    }
}
