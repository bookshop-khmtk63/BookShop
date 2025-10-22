package com.example.backend.service.implement;

import com.example.backend.common.TrangThaiDonHang;
import com.example.backend.dto.response.BookReviewResponse;
import com.example.backend.dto.response.OrderDetailResponse;
import com.example.backend.dto.response.OrderItemResponse;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.model.DonHang;
import com.example.backend.model.KhachHang;
import com.example.backend.repository.DonHangChiTietRepository;
import com.example.backend.repository.DonHangRepository;
import com.example.backend.service.BookReviewService;
import com.example.backend.service.CustomerService;
import com.example.backend.service.OrderDetailService;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImplement implements OrderService {
    private final DonHangRepository orderRepository;
    private final OrderDetailService orderDetailService;
    private final BookReviewService bookReviewService;
    private final CustomerService customerService;
    @Override
    public PageResponse<OrderDetailResponse> getAllOrder(Integer idKhachHang, Pageable pageable) {
        List<TrangThaiDonHang> listOrder  = List.of(TrangThaiDonHang.HOAN_THANH);
        Page<OrderDetailResponse> orderDetailResponses = orderRepository.findByOderByCustomerIdAndStatus(idKhachHang,pageable,listOrder);

        return enrichOrdersWithItems(orderDetailResponses,idKhachHang);
    }

    @Override
    public PageResponse<OrderDetailResponse> getTrackingOrder(Integer idKhachHang, Pageable pageable) {
        List<TrangThaiDonHang> listOrder = List.of(TrangThaiDonHang.DANG_GIAO,TrangThaiDonHang.CHO_XU_LY);
        Page<OrderDetailResponse> orderDetailResponses = orderRepository.findByOderByCustomerIdAndStatus(idKhachHang,pageable, listOrder);
        return enrichOrdersWithItems(orderDetailResponses,null);
    }

    @Override
    public void saveOrder(DonHang order) {
        orderRepository.save(order);
    }


    private PageResponse<OrderDetailResponse> enrichOrdersWithItems(Page<OrderDetailResponse> orderDetailResponses,Integer idKhachHang) {
        if (orderDetailResponses.getContent().isEmpty()) {
            return PageResponse.empty(0,1);
        }
        List<Integer> idOrder = orderDetailResponses.getContent().stream().map(OrderDetailResponse::getIdOrder).toList();
        log.info("id  don hang: {}", idOrder );

        List<OrderItemResponse> orderItemResponses = orderDetailService.findByOderItemByOrderID(idOrder);
        orderItemResponses.forEach(item -> {item.setLinePrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));});
        //Kiểm tra trạng thái xem sách đã đươcj đánh giá chưa
        if(!orderItemResponses.isEmpty() && idKhachHang!=null) {
            //Lấy danh sách idbook trong history
            Set<Integer> bookIds = orderItemResponses.stream().map(OrderItemResponse::getBookId).collect(Collectors.toSet());

            //Lấy ds idbook đã được đnash giá
            Set<Integer> idBookReview = bookReviewService.findReviewBookIdAndCustomer(bookIds,idKhachHang);
            orderItemResponses.forEach(orderItemResponse -> {
                if(idBookReview.contains(orderItemResponse.getBookId())) {
                    orderItemResponse.setReview(true);
                }
            });

        }

        Map<Integer,List<OrderItemResponse>> listMap = orderItemResponses.stream()
                .collect(Collectors.groupingBy(item-> findOrderIdForItem(item, orderDetailResponses.getContent())));

        List<OrderDetailResponse> listOrder = orderDetailResponses.getContent().stream().map(summary ->{
            return OrderDetailResponse.builder()
                    .idOrder(summary.getIdOrder())
                    .idCustomer(summary.getIdCustomer())
                    .status(summary.getStatus())
                    .address(summary.getAddress())
                    .amount(summary.getAmount())
                    .totalPrice(summary.getTotalPrice())
                    .items(listMap.getOrDefault(summary.getIdOrder(), Collections.emptyList()))
                    .build();
        }).collect(Collectors.toList());
        return PageResponse.from(orderDetailResponses,listOrder);
    }


    private Integer findOrderIdForItem(OrderItemResponse item, List<OrderDetailResponse> content) {
        log.info("chi tiet don hang : {}", item.toString() );

        for (OrderDetailResponse orderDetailResponse : content) {
            if(Objects.equals(orderDetailResponse.getIdOrder(), item.getOrderDetailId())) {
                return orderDetailResponse.getIdOrder();
            }
        }
        throw new AppException(ErrorCode.NOT_FOUND_ORDER_ID);
    }
}
