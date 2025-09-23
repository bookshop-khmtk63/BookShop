package com.example.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
@Getter
public enum ErrorCode {

    AUTHENTICATION_EXCEPTION(1001,"Lỗi xác thực ",HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(1003, "Truy cập bị từ chối", HttpStatus.FORBIDDEN),
    VALIDATION_EXCEPTION(1002, "Dữ liệu không hợp lệ", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION(1003,"Lỗi không mong muốn" ,HttpStatus.BAD_REQUEST),
    BOOK_NOT_FOUND(2001,"Không tìm thấy sách " , HttpStatus.NOT_FOUND ),
    FILTER_EXCEPTION(2002,"filter không hợp lê" ,HttpStatus.BAD_REQUEST );
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
