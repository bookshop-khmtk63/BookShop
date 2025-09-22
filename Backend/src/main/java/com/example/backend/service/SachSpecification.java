package com.example.backend.service;

import com.example.backend.common.SearchOperation;
import com.example.backend.model.Sach;
import com.example.backend.model.SearchCriteria;
import com.example.backend.model.TheLoai;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class SachSpecification {


    public static Specification<Sach> fromCriteria(List<SearchCriteria> criteriaList) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            for (SearchCriteria criteria : criteriaList) {
                String key = criteria.getKey();
                String valueStr = criteria.getValue().toString();
                SearchOperation operation = criteria.getOperation();

                log.info("Đang xử lý tiêu chí: Key='{}', Operation='{}', Value='{}'", key, operation, valueStr);

                try {
                    // Xử lý JOIN với bảng THE_LOAI
                    if ("theLoai".equalsIgnoreCase(key)) {
                        query.distinct(true);
                        Join<Sach, TheLoai> theLoaiJoin = root.join("danhSachTheLoai");
                        predicates.add(criteriaBuilder.like(
                                criteriaBuilder.lower(theLoaiJoin.get("tenTheLoai")),
                                "%" + valueStr.toLowerCase() + "%"
                        ));
                        log.info("=> Đã thêm bộ lọc JOIN cho 'theLoai'");
                        continue;
                    }

                    // Xử lý các trường còn lại trên chính Entity Sach
                    Object value = convertValueForSachEntity(key, valueStr);
                    switch (operation) {
                        case EQUAL:
                            predicates.add(criteriaBuilder.equal(root.get(key), value));
                            break;
                        case LIKE:
                            predicates.add(criteriaBuilder.like(
                                    criteriaBuilder.lower(root.get(key)),
                                    "%" + value.toString().toLowerCase() + "%"));
                            break;
                        case GREATER_THAN:
                            predicates.add(criteriaBuilder.greaterThan(root.get(key), (Comparable) value));
                            break;
                        case LESS_THAN:
                            predicates.add(criteriaBuilder.lessThan(root.get(key), (Comparable) value));
                            break;
                        case GREATER_THAN_OR_EQUAL:
                            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(key), (Comparable) value));
                            break;
                        case LESS_THAN_OR_EQUAL:
                            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get(key), (Comparable) value));
                            break;
                    }
                    log.info("=> Đã thêm bộ lọc thành công cho key '{}'", key);

                } catch (Exception e) {
                    // Ghi log lỗi chi tiết hơn
                    log.error("Bỏ qua bộ lọc cho key '{}'. Lỗi: {}", key, e.getMessage(), e);
                }
            }

            if (predicates.isEmpty()) {
                log.warn("Không có bộ lọc nào được áp dụng. Trả về tất cả kết quả.");
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Các hàm helper giữ nguyên như phiên bản dùng Reflection trước đó
    private static Field getFieldFromSachEntity(String fieldName) throws NoSuchFieldException {
        return Sach.class.getDeclaredField(fieldName);
    }

    private static Object convertValueForSachEntity(String fieldName, String rawValue) throws NoSuchFieldException {
        Field field = getFieldFromSachEntity(fieldName);
        Class<?> fieldType = field.getType();

        if (fieldType == String.class) return rawValue;
        if (fieldType == Integer.class || fieldType == int.class) return Integer.parseInt(rawValue);
        if (fieldType == BigDecimal.class) return new BigDecimal(rawValue);
        // ... thêm các kiểu khác nếu cần
        throw new IllegalArgumentException("Kiểu dữ liệu không được hỗ trợ: " + fieldType.getName());
    }
}