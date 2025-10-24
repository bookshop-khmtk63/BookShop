package com.example.backend.dto.response;

import com.example.backend.common.Role;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerResponse {
    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private Role role;
    private boolean locked;
    private Boolean emailChanged;
}
