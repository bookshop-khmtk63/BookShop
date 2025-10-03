package com.example.backend.model;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {
    private final KhachHang user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(user.getRole()==null){
            return Collections.emptyList();
        }
        return List.of(new SimpleGrantedAuthority("ROLE_"+user.getRole().name()));
    }


    @Override
    public String getPassword() {
        return user.getMatKhau();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.isLocked() ;
    }

    @Override
    public boolean isCredentialsNonExpired()     {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return user.isActive();
    }
}
