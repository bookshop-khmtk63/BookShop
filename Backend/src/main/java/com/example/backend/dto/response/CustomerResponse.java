package com.example.backend.dto.response;

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
    private boolean locked;
}
