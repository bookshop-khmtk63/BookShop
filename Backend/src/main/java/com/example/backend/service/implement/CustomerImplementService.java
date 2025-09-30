package com.example.backend.service.implement;

import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.CustomerResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.CustomerMapper;
import com.example.backend.model.KhachHang;
import com.example.backend.repository.KhachHangRepository;
import com.example.backend.service.CustomerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerImplementService implements CustomerService {
    private final KhachHangRepository khachHangRepository;
    private final CustomerMapper customerMapper;
    public KhachHang getCustomerByEmail(String email) {
        return khachHangRepository.findByEmail(email).orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(UserUpdateRequest userUpdateRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        KhachHang customer = getCustomerByEmail(email);
        boolean hasEmailChanged = false;
        if(userUpdateRequest.getFullName() != null && !userUpdateRequest.getFullName().isEmpty()) {
            customer.setHoTen(userUpdateRequest.getFullName());
        }
        String newEmail = userUpdateRequest.getEmail();
        if (newEmail != null && !newEmail.isBlank() && !newEmail.equalsIgnoreCase(email)) {
            if (khachHangRepository.existsByEmail(newEmail)) {
                throw new AppException(ErrorCode.USER_ALREADY_EXIST); // Hoặc EMAIL_ALREADY_IN_USE
            }
            customer.setEmail(newEmail);
            hasEmailChanged = true;

        }

        String newPhone = userUpdateRequest.getPhone();
        if (newPhone != null && !newPhone.isBlank() && !newPhone.equals(customer.getSoDienThoai())) {

            if (khachHangRepository.existsBySoDienThoai(newPhone)) {
                throw new AppException(ErrorCode.PHONE_ALREADY_EXIST);
            }
            customer.setSoDienThoai(newPhone);
        }

        if (userUpdateRequest.getAddress() != null && !userUpdateRequest.getAddress().isEmpty()) {
            customer.setDiaChi(userUpdateRequest.getAddress());
        }
        CustomerResponse response = customerMapper.toCustomerResponse(customer);
        if (hasEmailChanged) {
            response.setEmailChanged(true);
        }

        return response;
    }
}
