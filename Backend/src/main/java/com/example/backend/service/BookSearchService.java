package com.example.backend.service;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import com.example.backend.dto.response.PageResponse;
import com.example.backend.model.BookElasticsearch;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHitSupport;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.SearchPage;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookSearchService {
    private final ElasticsearchOperations elasticsearchOperations;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("_score", "gia", "diem_trung_binh");

    public PageResponse<BookElasticsearch> advancedSearch(String keyWord, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (keyWord == null || keyWord.isBlank()) {
            Query query = Query.of(q->q.matchAll(m->m));
            return searchWithQuery(query, pageable);
        }
        Query query = Query.of(q -> q
                .multiMatch(mm -> mm
                        .query(keyWord)
                        .fields("ten_sach^3", "mo_ta") // Gán trọng số khác nhau
                        .type(TextQueryType.BestFields) // Kiểu truy vấn phù hợp cho việc tìm kiếm trên nhiều trường
                        .fuzziness("AUTO") // Cho phép lỗi chính tả
                        .minimumShouldMatch("100%") // Yêu cầu ít nhất 70% từ khóa phải khớp
                )
        );
        // 4. Thực thi truy vấn
        return searchWithQuery(query, pageable);
    }

    private PageResponse<BookElasticsearch> searchWithQuery(Query finalQuery, Pageable pageable) {
        NativeQuery nativeQuery = NativeQuery.builder()
                .withQuery(finalQuery)
                .withPageable(pageable)
                .build();

        SearchHits<BookElasticsearch> searchHits = elasticsearchOperations.search(nativeQuery, BookElasticsearch.class);
        List<SearchHit<BookElasticsearch>> searchHitList = searchHits.getSearchHits();
        List<BookElasticsearch> bookElasticsearchList = searchHitList.stream().map(SearchHit::getContent).collect(Collectors.toList());
        SearchPage<BookElasticsearch> searchPage = SearchHitSupport.searchPageFor(searchHits,pageable);
        return PageResponse.from(searchPage,bookElasticsearchList);
    }



}
