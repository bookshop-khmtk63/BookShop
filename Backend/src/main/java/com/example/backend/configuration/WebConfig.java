package com.example.backend.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Cho phép cả domain FE trên Render và localhost để dev
                .allowedOrigins("http://localhost:3000",
                        "https://bookshop-jeh4.onrender.com/","http://127.0.0.1:5501/index.html")
                .allowedMethods("*") // GET, POST, PUT, DELETE...
                .allowedHeaders("*")
                .allowCredentials(true); // Cho phép gửi cookie/token
    }
}
