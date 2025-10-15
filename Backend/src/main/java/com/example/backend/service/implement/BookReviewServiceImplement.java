package com.example.backend.service.implement;

import com.example.backend.common.TrangThaiDonHang;
import com.example.backend.dto.request.CreateReviewRequest;
import com.example.backend.dto.response.BookReviewResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.BookReviewMapper;
import com.example.backend.model.Book;
import com.example.backend.model.DanhGiaSach;
import com.example.backend.model.KhachHang;
import com.example.backend.repository.DanhGiaSachRepository;
import com.example.backend.repository.KhachHangRepository;
import com.example.backend.service.BookReviewService;
import com.example.backend.service.BookService;
import com.example.backend.service.CustomerService;
import com.example.backend.service.OrderDetailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookReviewServiceImplement implements BookReviewService {
    private final DanhGiaSachRepository bookReviewRepository;
    private final CustomerService customerService;
    private final BookService bookService;
    private final BookReviewMapper bookReviewMapper;
    private final OrderDetailService orderDetailService;
    @Override
    @Transactional
    public BookReviewResponse createReview(CreateReviewRequest createReviewRequest, String email, Integer bookId) {
        Book book = bookService.getBookByIds(bookId);
        KhachHang customer= customerService.getCustomerByEmail(email);
        boolean hasPurchased = orderDetailService.hasPurchasedAndReceived(customer.getIdKhachHang(),book.getIdSach(), TrangThaiDonHang.HOAN_THANH);
        if(!hasPurchased){
            throw new AppException(ErrorCode.BOOK_NOT_PURCHASE_AND_RECEIVED);
        }
        if(bookReviewRepository.existsByKhachHangAndSach(customer,book)){
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }
        DanhGiaSach bookReview = DanhGiaSach.builder()
                .sach(book)
                .binhLuan(createReviewRequest.getComment())
                .diemXepHang(createReviewRequest.getRating())
                .ngayDanhGia(Instant.now())
                .khachHang(customer)
                .build();
            bookReviewRepository.save(bookReview);
        return bookReviewMapper.toBookReview(bookReview) ;
    }

    @Override
    public Set<Integer> findReviewBookIdAndCustomer(Set<Integer> bookIds, Integer idKhachHang) {

        return bookReviewRepository.findReviewBookIdAndCustomer(bookIds,idKhachHang);
    }
}
