package com.example.backend.repository;

import com.example.backend.model.BookElasticsearch;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

public interface BookElasticsearchRepository extends ElasticsearchRepository<BookElasticsearch,Long> {
}
