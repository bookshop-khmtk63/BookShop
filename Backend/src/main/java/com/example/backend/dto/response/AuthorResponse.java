package com.example.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthorResponse {
    private Integer idAuthor;
    private String author;
}
