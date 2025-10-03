package com.example.backend.dto.response;

import com.example.backend.common.Role;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    private String email;
    private Role role;

}
