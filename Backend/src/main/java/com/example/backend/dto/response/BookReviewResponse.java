package com.example.backend.dto.response;

import lombok.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookReviewResponse {
    private Integer id;
    private double rating;
    private String comment;
    private Instant timestamp;
    private Integer userId;
    private String fullName;

}
