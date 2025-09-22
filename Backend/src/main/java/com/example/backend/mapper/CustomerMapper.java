package com.example.backend.mapper;

import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.dto.response.CustomerResponse;
import com.example.backend.model.KhachHang;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CustomerMapper {
    public CustomerResponse toCustomerResponse(KhachHang customer) {
        if (customer == null) {
            return null;
        }
        return CustomerResponse.builder()
                .id(customer.getIdKhachHang())
                .phone(customer.getSoDienThoai())
                .email(customer.getEmail())
                .fullName(customer.getHoTen())
                .address(customer.getDiaChi())
                .build();
    }
    public List<CustomerResponse> toCustomerResponseList(List<KhachHang> customers) {
        if (customers == null) {
            return null;
        }
        return customers.stream().map(this::toCustomerResponse).collect(Collectors.toList());
    }
}
