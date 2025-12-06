package com.example.backend.mapper;

import com.example.backend.dto.response.AuthorResponse;
import com.example.backend.model.TacGia;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
@Component
@RequiredArgsConstructor
public class AuthorMapper {
    public AuthorResponse authorResponse(TacGia author) {
        if(author == null) return null;
        return  AuthorResponse.builder()
                .idAuthor(author.getId())
                .author(author.getTenTacGia())
                .build();
    }
    public List<AuthorResponse> authorResponse(List<TacGia> authors) {
        if(authors == null) return Collections.emptyList();
        return authors.stream().map(this::authorResponse).collect(Collectors.toList());
    }
}
