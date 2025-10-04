package com.example.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private int code;
    private String message;
    private String error;
    private String path;
    private Map<String, String> validationErrors;
}
