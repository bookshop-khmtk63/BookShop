package com.example.backend.service.implement;

import com.example.backend.common.TrangThaiDonHang;
import com.example.backend.dto.response.*;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.OrderMapper;
import com.example.backend.model.DonHang;
import com.example.backend.model.KhachHang;
import com.example.backend.repository.DonHangChiTietRepository;
import com.example.backend.repository.DonHangRepository;
import com.example.backend.service.BookReviewService;
import com.example.backend.service.CustomerService;
import com.example.backend.service.OrderDetailService;
import com.example.backend.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
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
    private final OrderMapper orderMapper;
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

    @Override
    public RevenueStatisticsResponse getRevenueStatistics(LocalDate startDate, LocalDate endDate, String period) {
        // Chuyển đổi LocalDate sang Instant để truy vấn
        Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endInstant = endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        TrangThaiDonHang status = TrangThaiDonHang.HOAN_THANH;

        // 1. Lấy các số liệu tổng quan
        SummaryStats summary = orderRepository.findSummaryStats(startInstant, endInstant, status);
        BigDecimal totalRevenue = Optional.ofNullable(summary.getTotalRevenue()).orElse(BigDecimal.ZERO);
        Long totalOrders = Optional.ofNullable(summary.getTotalOrders()).orElse(0L);
        // 2. Lấy dữ liệu cho biểu đồ tùy theo 'period'
        List<Object[]> results;
        if ("monthly".equalsIgnoreCase(period)) {
            results = orderRepository.findRevenueGroupByMonth(startInstant, endInstant, status.name());
        } else { // Mặc định là 'daily'
            results = orderRepository.findRevenueGroupByDay(startInstant, endInstant, status.name());
        }


        // 3. Chuyển đổi kết quả một cách an toàn
        List<DataPoint> revenueOverTime = results.stream()
                .map(record -> {
                    // XỬ LÝ ĐÚNG KIỂU DỮ LIỆU Ở ĐÂY
                    Object labelObject = record[0];
                    String label;
                    if (labelObject instanceof java.sql.Date) {
                        // Nếu là kiểu Date, chuyển nó thành chuỗi "yyyy-MM-dd"
                        label = ((java.sql.Date) labelObject).toLocalDate().toString();
                    } else {
                        // Xử lý các trường hợp khác nếu có (ví dụ: DATE_FORMAT trả về String)
                        label = String.valueOf(labelObject);
                    }

                    BigDecimal value = (record[1] instanceof Double)
                            ? BigDecimal.valueOf((Double) record[1])
                            : (BigDecimal) record[1];

                    return new DataPoint(label, value);
                })
                .collect(Collectors.toList());

        return RevenueStatisticsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .revenueOverTime(revenueOverTime)
                .build();
    }

    @Override
    public PageResponse<OrderDetailResponse> getAllOrderAdmin(Integer idKhachHang, Pageable pageable) {
        Page<OrderDetailResponse> orderDetailResponsePage = orderRepository.findByOrder(pageable);
        return enrichOrdersWithItems(orderDetailResponsePage,null);
    }

    @Override
    @Transactional
    public OrderDetailResponse updateOrderStatus(Integer orderId, TrangThaiDonHang newStatus) {
        DonHang order = orderRepository.findById(orderId).orElseThrow(()->new AppException(ErrorCode.NOT_FOUND_ORDER_ID));
        Set<TrangThaiDonHang> statusOrder = Set.of(TrangThaiDonHang.HOAN_THANH,TrangThaiDonHang.DANG_GIAO,TrangThaiDonHang.DA_HUY);
        if (!statusOrder.contains(newStatus)) {
            throw new AppException(ErrorCode.INVALID_STATUS_UPDATE);
        }
        TrangThaiDonHang status = order.getTrangThai();
        if(status==TrangThaiDonHang.HOAN_THANH || status==TrangThaiDonHang.DA_HUY){
            throw new AppException(ErrorCode.STATUS_UPDATE_NOT_ALLOWED);
        }
        order.setTrangThai(newStatus);
        DonHang updatedOrder = orderRepository.save(order);
        return orderMapper.toOrderDetailResponse(updatedOrder);
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
