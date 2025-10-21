package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DeleteCartItemRequest {
    private List<Integer> cartItemIds;
}
