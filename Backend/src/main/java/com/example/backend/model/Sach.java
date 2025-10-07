package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "SACH")
public class Sach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sach")
    private Integer idSach;

    @Column(name = "ten_sach", nullable = false)
    private String tenSach;


    @Column(name = "gia", nullable = false, precision = 12, scale = 2)
    private BigDecimal gia;

    @Column(name = "so_luong", nullable = false)
    private int soLuong = 0;
    @Column(name="anh_sach",nullable = false)
    private String anhSach;

    @Lob
    @Column(name = "mo_ta")
    private String moTa;
    @Builder.Default

    @OneToMany(mappedBy = "sach",  cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<DanhGiaSach> danhGias = new HashSet<>() ;
    @Builder.Default
    @Column(name = "diem_trung_binh", nullable = false)
    private Double diemTrungBinh = 0.0;


    @ManyToOne(fetch = FetchType.LAZY) // LAZY là best practice
    @JoinColumn(name = "id_tac_gia") // Ánh xạ tới cột khóa ngoại id_tac_gia trong bảng SACH
    @ToString.Exclude // Tránh vòng lặp vô hạn khi logging
    private TacGia tacGia;
    @ManyToMany(fetch = FetchType.LAZY,cascade = {CascadeType.MERGE})
    @JoinTable(name = "SACH_THE_LOAI", // Tên bảng trung gian trong CSDL
            joinColumns = @JoinColumn(name = "id_sach"), // Khóa ngoại trỏ về bảng hiện tại (SACH)
            inverseJoinColumns = @JoinColumn(name = "id_the_loai")
    )// Khóa ngoại trỏ về bảng kia (THE_LOAI))
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<TheLoai> danhSachTheLoai =new HashSet<>() ;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Sach sach = (Sach) o;
        return getIdSach() != null && Objects.equals(getIdSach(), sach.getIdSach());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
