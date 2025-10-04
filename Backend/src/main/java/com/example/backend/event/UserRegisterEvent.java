package com.example.backend.event;

import com.example.backend.common.EventSendToEmail;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterEvent {
    private EventSendToEmail eventName;
    private Integer userId;
    private String email;
    private String appUrl;
    private String token;

}
