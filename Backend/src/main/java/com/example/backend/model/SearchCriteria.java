package com.example.backend.model;

import com.example.backend.common.SearchOperation;
import lombok.AllArgsConstructor;
import lombok.Getter;

    @Getter
    @AllArgsConstructor
    public class SearchCriteria {
        private String key;
        private SearchOperation operation;
        private Object value;
    }
