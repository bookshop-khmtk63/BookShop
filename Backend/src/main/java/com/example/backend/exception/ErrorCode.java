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
    REFRESHTOKEN_EXPIRED(2013,"Refresh token hết hạn, bạn hãy bắt đầu với phiên đăng nhập mới" ,HttpStatus.BAD_REQUEST ),
    USER_ALREADY_ACTIVATED(2014,"Taì khoản đã được kích hoạt" ,HttpStatus.CONFLICT ),
    INVALID_TOKEN(2015,"loai token không hợp lệ" ,HttpStatus.BAD_REQUEST ),
    EMAIL_SEND_FAILURE(2016,"Không gửi được gmail" ,HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(2017,"Không tìm thấy thể loại" ,HttpStatus.NOT_FOUND ),
    FILE_UPLOAD_ERROR(2018,"Lỗi upload file" ,HttpStatus.BAD_REQUEST ),
    AUTHOR_NOT_FOUND(2019,"Không tìm thấy tác giả" ,HttpStatus.NOT_FOUND ),
    NOT_FOUND_ORDER_ID(2020,"Khồng tim thấy đơn hàng",HttpStatus.NOT_FOUND ),
    BOOK_NOT_PURCHASE_AND_RECEIVED(2021,"Không tìm thấy sách trạng thái đã giao trong đơn hàng" ,HttpStatus.NOT_FOUND ),
    REVIEW_ALREADY_EXISTS(2022,"Đơn hàng đã được đánh giá" ,HttpStatus.CONFLICT ),
    CART_NOT_FOUND(2023,"Không tìm thấy giỏ hàng" ,HttpStatus.NOT_FOUND ),
    BOOK_OUT_OF_STOCK(2024,"Sách hêt hàng" ,HttpStatus.BAD_REQUEST ),
    ITEM_NOT_FOUND(2025,"Không tìm thấy sản phẩm trong giỏ hàng" ,HttpStatus.NOT_FOUND ),

    ADDRESS_REQUIRED(2026,"Bạn chưa cập nhạt địa chỉ" ,HttpStatus.BAD_REQUEST ),
    PHONE_NUMBER_REQUIED(2027,"Bạn chưa cập nhật sdt" ,HttpStatus.BAD_REQUEST ),
    USER_UNLOCKER(2028,"Taì khoản không bị khóa" ,HttpStatus.BAD_REQUEST ),
    REVIEW_NOT_FOUND(2029,"Không tìm thấy đánh giá" ,HttpStatus.NOT_FOUND ),
    RESOURCE_NOT_FOUND(2030,"không tìm thấy enpoin được yêu cầu " ,HttpStatus.NOT_FOUND ),
    INVALID_STATUS_UPDATE(2031,"Trangj thái update đơn hàng không hợp lệ" ,HttpStatus.BAD_REQUEST ),
    STATUS_UPDATE_NOT_ALLOWED(2032," Không thể thay đổi trạng thái của đơn hàng đã hoàn thành hoặc đã hủy.",HttpStatus.BAD_REQUEST ),;
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
