package com.example.backend.exception;

import com.example.backend.dto.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.expression.AccessException;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalHandlingException {
    /**
     * Xử lý chính cho tất cả các lỗi nghiệp vụ được định nghĩa (AppException).
     *
     */
    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ap , WebRequest webRequest) {
        ErrorCode errorCode = ap.getErrorCode();
        String path = webRequest.getDescription(false).replace("url=","");
        log.warn("Lỗi logic nghiệp vụ: Code[{}] Message [{}] Path [{}] ", errorCode.getCode(), errorCode.getMessage(), path );
        ErrorResponse errorResponse =ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.getCode())
                .error(errorCode.getHttpStatus().getReasonPhrase())
                .message(errorCode.getMessage())
                .path(path)
                .build();
        return ResponseEntity.status(errorCode.getHttpStatus()).body(errorResponse);
    }

    /**
     * Xử lý lỗi validation từ @Valid.
     *
     */
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, WebRequest webRequest) {
        ErrorCode errorCode = ErrorCode.VALIDATION_EXCEPTION;
        String path = webRequest.getDescription(false).replace("url=","");
        Map<String, String> validationException = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(fieldError -> validationException.put(fieldError.getField(), fieldError.getDefaultMessage()));
        log.warn("Lỗi validate dữ liệu Path[{}] Message [{}] ]", path, validationException);
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.getCode())
                .error(errorCode.getHttpStatus().getReasonPhrase())
                .message(errorCode.getMessage())
                .path(path)
                .validationErrors(validationException)
                .build();
        return ResponseEntity.status(errorCode.getHttpStatus()).body(errorResponse);
    }
    /**
     * Xử lý lỗi từ chối truy cập từ Spring Security.
     */
    @ExceptionHandler(value = AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessException( WebRequest webRequest) {
        ErrorCode errorCode =ErrorCode.ACCESS_DENIED;
        String path = webRequest.getDescription(false).replace("uri=", "");
        log.warn("Access Denied:Người dùng đã cố gắng truy cập vào một tài nguyên bị cấm. Path[{}]", path);
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.getCode())
                .error(errorCode.getHttpStatus().getReasonPhrase())
                .message(errorCode.getMessage())
                .path(path)
                .build();
        return ResponseEntity.status(errorCode.getHttpStatus().value()).body(errorResponse);
    }
    /**
     * Xử lý tất cả các lỗi không được định nghĩa khác
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUncategorizedException(Exception ex, WebRequest request) {

        log.error("Đã xảy ra ngoại lệ chưa phân loại: ", ex);
        ErrorCode errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION;

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.getCode())
                .error(errorCode.getHttpStatus().getReasonPhrase())
                .message(errorCode.getMessage())
                .path(request.getDescription(false).replace("url=", ""))
                .build();
        return ResponseEntity.status(errorCode.getHttpStatus()).body(errorResponse);
    }
//    @ExceptionHandler(NoResourceFoundException.class)
//    public ResponseEntity<ErrorResponse> handleNoResourceFound(NoResourceFoundException ex, WebRequest request) {
//        ErrorCode errorCode = ErrorCode.RESOURCE_NOT_FOUND;
//        ErrorResponse errorResponse = ErrorResponse.builder()
//                .timestamp(LocalDateTime.now())
//                .status(errorCode.getHttpStatus().value())
//                .code(errorCode.getCode())
//                .error(errorCode.getHttpStatus().getReasonPhrase())
//                .message("Không tìm thấy endpoint được yêu cầu.")
//                .path(request.getDescription(false).replace("uri=", ""))
//                .build();
//        return ResponseEntity.status(errorCode.getHttpStatus()).body(errorResponse);
//    }

}
