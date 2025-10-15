package com.example.backend.configuration;

import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.service.RedisService;
import com.example.backend.service.implement.UserDetailsServiceImplement;
import com.example.backend.utils.JwtTokenUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j // Thêm annotation

public class JwtAuthenticationFilter extends OncePerRequestFilter {
        private final RedisService redisService;
        private final JwtTokenUtils jwtTokenUtils;
        private final UserDetailsServiceImplement userDetailsService;
    @Override

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwtToken = header.substring(7);

        // 1. KIỂM TRA BLACKLIST
        if (redisService.isTokenInBlacklist(jwtToken)) {
            log.warn(">>> Token đã bị logout (có trong blacklist). Bỏ qua xác thực.");
            filterChain.doFilter(request, response);
            return;
        }

        String userEmail;
        try {
            // 2. GIẢI MÃ TOKEN
            userEmail = jwtTokenUtils.getUsernameFromToken(jwtToken);
        } catch (Exception e) {
            log.warn(">>> Lỗi khi giải mã token: {}. Bỏ qua xác thực.", e.getMessage());
            // CHỈ CẦN CHO ĐI TIẾP. EntryPoint sẽ xử lý.
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                if (jwtTokenUtils.validateToken(jwtToken, userDetails)) {

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info(">>> Đã set Authentication thành công cho user: {}", userDetails.getUsername());
                }
            } catch (UsernameNotFoundException | AppException e) {
                log.warn(">>> Xác thực thất bại: Không tìm thấy user '{}' từ token. Lỗi: {}", userEmail, e.getMessage());
                // Không làm gì cả, cứ để request đi tiếp mà không có Authentication.
            }
        }

        filterChain.doFilter(request, response);
    }
}
