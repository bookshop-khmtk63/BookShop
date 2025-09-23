package com.example.backend.service.implement;

import com.example.backend.common.SearchOperation;
import com.example.backend.dto.response.BookDetailResponse;
import com.example.backend.dto.response.BookResponse;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.exception.AppException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.BookMapper;
import com.example.backend.model.Sach;
import com.example.backend.model.SearchCriteria;
import com.example.backend.repository.SachRepository;
import com.example.backend.service.BookService;
import com.example.backend.service.SachSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class BookServiceImplement implements BookService {
    private final SachRepository sachRepository;
    private final BookMapper bookMapper;
    @Override
    public PageResponse<BookResponse> getAllBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Sach> sach = sachRepository.findAll(pageable);
        List<BookResponse> bookResponseList = bookMapper.toBookResponseList(sach.getContent());
        return PageResponse.from(sach,bookResponseList);
    }

    @Override
    public BookDetailResponse getBookById(int id) {
        Sach sach = sachRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.BOOK_NOT_FOUND));

        return bookMapper.toBookDetailResponse(sach);
    }

    @Override
    public PageResponse<BookResponse> filterBooks(int page, int size, List<String> filters) {
        List<SearchCriteria> criteriaList = new ArrayList<>();
        if (filters != null) {
            // SỬA LỖI REGEX TẠI ĐÂY
            Pattern pattern = Pattern.compile("([\\w.]+?)(:|>|<|>=|<=|==)([\\w\\s\\p{L}.-]+)");
            for (String filter : filters) {
                Matcher matcher = pattern.matcher(filter.trim());

                if (matcher.find()) {
                    String key = matcher.group(1);
                    String operator = matcher.group(2);
                    String value = matcher.group(3);

                    SearchOperation operation = mapOperator(operator);
                    if (operation != null) {
                        criteriaList.add(new SearchCriteria(key, operation, value));
                    }
                }
            }
        }

        Specification<Sach> specification = SachSpecification.fromCriteria(criteriaList);
        Pageable pageable = PageRequest.of(page,size);
        Page<Sach> sachPage = sachRepository.findAll(specification, pageable);

        List<BookResponse> bookResponses = sachPage.getContent()
                .stream()
                .map(bookMapper::toBookResponse)
                .toList();

        return PageResponse.from(sachPage,bookResponses);
    }

    @Override
    public PageResponse<BookResponse> advancedSearch(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Sach> sach = sachRepository.searchByKeyWord(keyword,pageable);
        return PageResponse.from(sach,bookMapper.toBookResponseList(sach.getContent()));
    }

    private SearchOperation mapOperator(String operator) {
        switch (operator) {
            case "==": return SearchOperation.EQUAL;
            case ":":  return SearchOperation.LIKE;
            case ">":  return SearchOperation.GREATER_THAN;
            case "<":  return SearchOperation.LESS_THAN;
            case ">=": return SearchOperation.GREATER_THAN_OR_EQUAL;
            case "<=": return SearchOperation.LESS_THAN_OR_EQUAL;
            default:   return null;
        }
    }
}
