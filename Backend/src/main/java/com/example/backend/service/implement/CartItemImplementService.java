package com.example.backend.service.implement;

import com.example.backend.dto.request.CartItemRequest;
import com.example.backend.dto.response.CartItemResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.CartMapper;
import com.example.backend.model.Book;
import com.example.backend.model.GioHang;
import com.example.backend.model.GioHangChiTiet;
import com.example.backend.model.KhachHang;
import com.example.backend.repository.GioHangChiTietRepository;
import com.example.backend.service.BookService;
import com.example.backend.service.CartItemService;
import com.example.backend.service.CartService;
import com.example.backend.service.CustomerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartItemImplementService implements CartItemService {
    private final GioHangChiTietRepository cartItemRepository;
    private final CartService cartService;
    private final BookService bookService;
    private final CartMapper cartMapper;
    private final CustomerService customerService;
    @Override
    @Transactional
    public CartItemResponse addItem(CartItemRequest cartItemRequest, String userName, Integer bookId) {
        KhachHang customer = customerService.getCustomerByEmail(userName);
        Book book = bookService.getBookByIds(bookId);

        // 1. Kiểm tra tồn kho trước khi xử lý
        if (cartItemRequest.getQuantity() > book.getSoLuong()) {
            throw new AppException(ErrorCode.BOOK_OUT_OF_STOCK);
        }

        // 2. Tìm hoặc Tạo mới Giỏ hàng (GioHang)
        GioHang cart = cartService.getCartOrCreateCart(customer.getIdKhachHang())
                .orElseGet(() -> {
                    return cartService.addCart(customer);
                });

        GioHangChiTiet cartItem = cartItemRepository.findByGioHangAndSach(cart, book);

        if (cartItem != null) {
            int newQuantity = cartItem.getSoLuong() + cartItemRequest.getQuantity();

            if (newQuantity > book.getSoLuong()) {
                throw new AppException(ErrorCode.BOOK_OUT_OF_STOCK);
            }

            cartItem.setSoLuong(newQuantity);
            cartItem = cartItemRepository.save(cartItem);

        } else {
            cartItem = GioHangChiTiet.builder()
                    .gioHang(cart)
                    .sach(book)
                    .soLuong(cartItemRequest.getQuantity())
                    .build();

            cartItem = cartItemRepository.save(cartItem);

            cart.getChiTietGioHang().add(cartItem);
        }
        return cartMapper.toCartItemResponse(cartItem);
    }
}
