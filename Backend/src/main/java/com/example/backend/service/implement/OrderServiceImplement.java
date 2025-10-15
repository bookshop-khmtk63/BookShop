package com.example.backend.service.implement;

import com.example.backend.common.TrangThaiDonHang;
import com.example.backend.dto.response.BookReviewResponse;
import com.example.backend.dto.response.OrderDetailResponse;
import com.example.backend.dto.response.OrderItemResponse;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.repository.DonHangChiTietRepository;
import com.example.backend.repository.DonHangRepository;
import com.example.backend.service.OrderDetailService;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImplement implements OrderService {
    private final DonHangRepository orderRepository;
    private final OrderDetailService orderDetailService;
    @Override
    public PageResponse<OrderDetailResponse> getAllOrder(Integer idKhachHang, Pageable pageable) {
        List<TrangThaiDonHang> listOrder  = List.of(TrangThaiDonHang.HOAN_THANH);
        Page<OrderDetailResponse> orderDetailResponses = orderRepository.findByOderByCustomerIdAndStatus(idKhachHang,pageable,listOrder);

        return enrichOrdersWithItems(orderDetailResponses);
    }

    @Override
    public PageResponse<OrderDetailResponse> getTrackingOrder(Integer idKhachHang, Pageable pageable) {
        List<TrangThaiDonHang> listOrder = List.of(TrangThaiDonHang.DANG_GIAO,TrangThaiDonHang.CHO_XU_LY);
        Page<OrderDetailResponse> orderDetailResponses = orderRepository.findByOderByCustomerIdAndStatus(idKhachHang,pageable, listOrder);
        return enrichOrdersWithItems(orderDetailResponses);
    }

    private PageResponse<OrderDetailResponse> enrichOrdersWithItems(Page<OrderDetailResponse> orderDetailResponses) {
        if (orderDetailResponses.getContent().isEmpty()) {
            return PageResponse.empty(0,1);
        }
        List<Integer> idOrder = orderDetailResponses.getContent().stream().map(OrderDetailResponse::getIdOrder).toList();
        log.info("id  don hang: {}", idOrder );

        List<OrderItemResponse> orderItemResponses = orderDetailService.findByOderItemByOrderID(idOrder);

        Map<Integer,List<OrderItemResponse>> listMap = orderItemResponses.stream().collect(Collectors.groupingBy(item-> findOrderIdForItem(item, orderDetailResponses.getContent())));

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
