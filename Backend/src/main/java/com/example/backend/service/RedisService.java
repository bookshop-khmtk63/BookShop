package com.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final static String TOKEN_BLACKLIST="TOKEN_BLACKLIST";
    public void saveToken(String token,long duration) {
        redisTemplate.opsForValue().set(TOKEN_BLACKLIST+token,"backList",duration, TimeUnit.MINUTES);
    }
    public boolean isTokenInBlacklist(String token) {
        return redisTemplate.hasKey(TOKEN_BLACKLIST+token);
    }
}
