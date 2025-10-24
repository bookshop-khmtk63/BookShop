package com.example.backend.service.implement;

import com.example.backend.dto.request.CartItemRequest;
import com.example.backend.dto.response.CartItemResponse;
import com.example.backend.dto.response.CartResponse;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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

    @Override
    @Transactional
    public int deleteItem(String username, List<Integer> cartItemIds) {
        if(cartItemIds==null || cartItemIds.isEmpty()){
            return 0;
        }
        KhachHang customer = customerService.getCustomerByEmail(username);
        return cartItemRepository.deleteByIdsAndCustomerId(cartItemIds,customer.getIdKhachHang());
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(String username, Integer cartItemId,CartItemRequest cartItemRequest) {
        KhachHang customer = customerService.getCustomerByEmail(username);
        GioHangChiTiet cartItem = cartItemRepository.findByIdItemAndIdCustomer(cartItemId,customer.getIdKhachHang())
                .orElseThrow(()->new AppException(ErrorCode.ITEM_NOT_FOUND));
        Book book = bookService.getBookByIds(cartItem.getSach().getIdSach());
        int newQuantity = cartItemRequest.getQuantity();
        if(newQuantity<=0){
            log.info("Xóa sách  trong giỏ hàng do số lượng nhỏ hơn 0: {}", cartItem.getSach().getTenSach());
            cartItemRepository.deleteById(cartItemId);
        }else {
            if(newQuantity>book.getSoLuong()){
                throw new AppException(ErrorCode.BOOK_OUT_OF_STOCK);
            }
            cartItem.setSoLuong(newQuantity);
        }
        return cartService.getCart(customer.getIdKhachHang());
    }

    @Override
    public void deleteAllItem(Integer customerId, List<Integer> idCartItem) {
         cartItemRepository.deleteByIdsAndCustomerId(idCartItem,customerId);
    }


}