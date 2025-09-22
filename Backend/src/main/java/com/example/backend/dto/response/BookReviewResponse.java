package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class BookReviewResponse {
    private Integer id;
    private double rating;
    private String comment;
    private Timestamp timestamp;
    private Integer userId;
    private String fullName;
}
