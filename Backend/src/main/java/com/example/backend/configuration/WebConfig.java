package com.example.backend.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("https://bookshop-jeh4.onrender.com/") // Cho phép tất cả domain
                .allowedMethods("*")        // GET, POST, PUT, DELETE, OPTIONS
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
