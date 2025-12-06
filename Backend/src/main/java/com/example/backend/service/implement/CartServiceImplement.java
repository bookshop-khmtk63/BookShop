package com.example.backend.service.implement;

import com.example.backend.common.TrangThaiDonHang;
import com.example.backend.dto.response.CartResponse;
import com.example.backend.dto.response.OrderDetailResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.CartMapper;
import com.example.backend.mapper.OrderMapper;
import com.example.backend.model.*;
import com.example.backend.repository.GioHangChiTietRepository;
import com.example.backend.repository.GioHangRepository;
import com.example.backend.service.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImplement implements CartService {
    private final GioHangRepository cartRepository;
    private final CartMapper cartMapper;
    private final CustomerService customerService;
    private final OrderMapper orderMapper;
    private final OrderService orderService;
    private final BookService bookService;
    private final OrderDetailService orderDetailService;
    private final GioHangChiTietRepository cartItemRepository;
    @Override
    public CartResponse getCart(Integer idCustomer) {
        GioHang cart = cartRepository.findByCustomerIdWithDetails(idCustomer).
                orElseThrow(()->new AppException(ErrorCode.CART_NOT_FOUND));
        return cartMapper.toCartResponse(cart);
    }


    @Override
    public GioHang getCartById(Integer idKhachHang) {
        return cartRepository.findByCustomerIdWithDetails(idKhachHang).
                orElseThrow(()->new AppException(ErrorCode.CART_NOT_FOUND));
    }

    @Override
    public Optional<GioHang> getCartOrCreateCart(Integer idKhachHang) {

        return cartRepository.findByKhachHang_IdKhachHang(idKhachHang);
    }

    @Override
    public GioHang addCart(KhachHang customer) {
        GioHang newCart = GioHang.builder()
                .khachHang(customer) // Phải gán KhachHang khi tạo giỏ hàng
                .build();
        return cartRepository.save(newCart); // LƯU giỏ hàng để có ID
    }

    @Override
    @Transactional
    public OrderDetailResponse payOrder(String username) {
        KhachHang customer = customerService.getCustomerByEmail(username);
        if(customer.getDiaChi()==null || customer.getDiaChi().isEmpty()){
            throw new AppException(ErrorCode.ADDRESS_REQUIRED);
        }
        if(customer.getSoDienThoai()==null || customer.getSoDienThoai().isEmpty()){
            throw new AppException(ErrorCode.PHONE_NUMBER_REQUIED);
        }
        GioHang cart = cartRepository.findByCustomerIdWithDetails(customer.getIdKhachHang()).
                orElseThrow(()->new AppException(ErrorCode.CART_NOT_FOUND));
        if (cart.getChiTietGioHang().isEmpty()){
            throw new AppException(ErrorCode.ITEM_NOT_FOUND);
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        DonHang order = DonHang.builder()
                .khachHang(customer)
                .diaChiGiaoHang(customer.getDiaChi())
                .ngayDat(Instant.now())
                .trangThai(TrangThaiDonHang.CHO_XU_LY)
                .tongTien(totalPrice)
                .build();
        orderService.saveOrder(order);
        List<DonHangChiTiet> orderDetail = new ArrayList<>();
        List<Integer> idCartItem = new ArrayList<>();
        int quantity = 0;
        for (GioHangChiTiet cartIem : cart.getChiTietGioHang()) {
//            Book book = cartIem.getSach();
            //Pessimistic Locking
            Book book = bookService.getBookByIdForUpdate(cartIem.getSach().getIdSach());
            if(cartIem.getSoLuong()>book.getSoLuong()){
                throw new AppException(ErrorCode.BOOK_OUT_OF_STOCK);
            }
            idCartItem.add(cartIem.getId());
            DonHangChiTiet orders = DonHangChiTiet.builder()
                    .sach(book)
                    .gia(book.getGia())
                    .soLuong(cartIem.getSoLuong())
                    .donHang(order)
                    .build();
            orderDetail.add(orders);
            quantity=quantity+cartIem.getSoLuong();
            totalPrice = totalPrice.add(book.getGia().multiply(BigDecimal.valueOf(cartIem.getSoLuong())));

            book.setSoLuong(book.getSoLuong()-cartIem.getSoLuong());
        }
        orderDetailService.save(orderDetail);
        order.setTongTien(totalPrice);
        order.setNgayDat(Instant.now());
        order.setChiTietDonHang(new HashSet<>(orderDetail));
        cartItemRepository.deleteByIdsAndCustomerId(idCartItem,customer.getIdKhachHang());
        OrderDetailResponse orderDetailResponse = orderMapper.toOrderDetailResponse(order);
        orderDetailResponse.setAmount(quantity);
        return orderDetailResponse;
    }


}
