package com.example.backend.configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
@Value("${cloudinary.cloud-name}")
    private String cloudName;
@Value("${cloudinary.api-secret}")
    private String apiSecret;
@Value("${cloudinary.api-key}")
    private String apiKey;
@Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name",cloudName,
                "api_secret",apiSecret,
                "api_key",apiKey
        ));
}
}
