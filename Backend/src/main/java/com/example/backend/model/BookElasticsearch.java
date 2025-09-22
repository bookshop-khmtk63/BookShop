//package com.example.backend.model;
//
//import jakarta.persistence.Id;
//import lombok.*;
//import org.springframework.data.elasticsearch.annotations.Document;
//import org.springframework.data.elasticsearch.annotations.Field;
//import org.springframework.data.elasticsearch.annotations.FieldType;
//import org.springframework.data.elasticsearch.annotations.Setting;
//
//import java.io.Serializable;
//import java.math.BigDecimal;
//import java.util.Set;
//
//@Document(indexName = "book")
//@Setting(settingPath = "elasticsearch/analyzer.json")
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//public class BookElasticsearch implements Serializable {
//    private static final long serialVersionUID = 1L;
//    @Id
//    private String id;
//
//    @Field(name="ten_sach", type = FieldType.Text, analyzer = "vietnamese_analyzer", searchAnalyzer = "vietnamese_analyzer")
//    private String tenSach;
//
//    @Field(name= "mo_ta",type = FieldType.Text,analyzer = "vietnamese_analyzer", searchAnalyzer = "vietnamese_analyzer")
//    private String moTa;
//    @Field(name = "gia", type = FieldType.Double)
//    private BigDecimal gia;
//
//    /**
//     * Số lượng tồn kho: Dùng để lọc các sách còn hàng.
//     */
//    @Field(name = "so_luong", type = FieldType.Integer)
//    private int soLuong;
//    /**
//     * Ảnh sách: Lưu dưới dạng Keyword để không bị phân tích.
//     * Dùng để hiển thị trong kết quả tìm kiếm.
//     */
//    @Field(name = "anh_sach", type = FieldType.Keyword, index = false) // index=false vì không cần tìm kiếm trên URL ảnh
//    private String anhSach;
//    /**
//     * Danh sách tên thể loại:
//     * - FieldType.Keyword: Để lọc chính xác (ví dụ: "Lấy sách có thể loại là 'Văn học'").
//     * - FieldType.Text: Để tìm kiếm (ví dụ: tìm "văn" ra "Văn học").
//     * Chúng ta dùng multi-field để hỗ trợ cả hai.
//     */
//    @Field(name = "the_loai")
//    private Set<String> danhSachTheLoai;
//    /**
//     * Điểm đánh giá trung bình:
//     * Dùng để sắp xếp kết quả tìm kiếm theo sách được đánh giá cao nhất.
//     */
//    @Field(name = "diem_trung_binh", type = FieldType.Double)
//    private Double diemTrungBinh;
//}
