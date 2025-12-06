package com.example.backend.service.implement;

import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.model.CustomUserDetails;
import com.example.backend.model.KhachHang;
import com.example.backend.repository.KhachHangRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserDetailsServiceImplement implements UserDetailsService {
    private final KhachHangRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username)  {
        log.info("--- BẮT ĐẦU QUÁ TRÌNH XÁC THỰC CHO USER: {}", username);
        KhachHang user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + username));
        log.info("--- TÌM THẤY USER: {}. Mật khẩu đã mã hóa trong DB là: {}", username, user.getMatKhau());
        log.info("--- TRẠNG THÁI TÀI KHOẢN: active={}, locked={}", user.isActive(), user.isLocked());
        return new CustomUserDetails(user);
    }
}
