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
    FILTER_EXCEPTION(2002,"filter không hợp lê" ,HttpStatus.BAD_REQUEST ),
    USER_NOT_FOUND(2003,"Không tìm thấy tài khoản" ,HttpStatus.NOT_FOUND ),
    USER_ALREADY_EXIST(2004,"Người dùng đã tồn tại" ,HttpStatus.CONFLICT ),
    PHONE_ALREADY_EXIST(2005,"Số điện thoại đã tồn tại" ,HttpStatus.CONFLICT ),
    USER_LOCKER(2006,"Tài khoản đang bị khóa" ,HttpStatus.FORBIDDEN ),
    USER_NOT_ACTIVE(2007,"Tài khoản chưa được kích hoạt" ,HttpStatus.FORBIDDEN ),
    TOKEN_NOT_FOUND(2008,"Không tìm thấy token" ,HttpStatus.NOT_FOUND ),
    TOKEN_ALREADY_USED(2009,"Token đã được kich hoạt" ,HttpStatus.BAD_REQUEST ),
    TOKEN_EXPIRED(2010,"Token hết hạn" ,HttpStatus.BAD_REQUEST ),
    PASSWORD_CONFIRMATION_MISMATCH(2011,"Mật khẩu và xác nhận mật khẩu không khớp." ,HttpStatus.BAD_REQUEST ),
    BAD_CREDENTIALS(2012,"Sai tài khoản hoặc mật khẩu" ,HttpStatus.BAD_REQUEST ),
    REFRESHTOKEN_EXPIRED(2013,"Refresh token hết hạn, bạn hãy bắt đầu với phiên đăng nhập mới" ,HttpStatus.UNAUTHORIZED ),
    USER_ALREADY_ACTIVATED(2014,"Taì khoản đã được kích hoạt" ,HttpStatus.CONFLICT ),
    INVALID_TOKEN(2015,"loai token không hợp lệ" ,HttpStatus.BAD_REQUEST ),
    EMAIL_SEND_FAILURE(2016,"Không gửi được gmail" ,HttpStatus.BAD_REQUEST),;
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
