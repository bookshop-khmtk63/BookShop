package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "DANH_GIA_SACH", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_khach_hang", "id_sach"})
})
public class DanhGiaSach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_danh_gia")
    private Integer idDanhGia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_khach_hang")
    @ToString.Exclude
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sach")
    @ToString.Exclude
    private Book sach;

    @Column(name = "diem_xep_hang", nullable = false)
    private int diemXepHang; // Từ 1 đến 5

    @Lob
    @Column(name = "binh_luan")
    private String binhLuan;

    @Column(name = "ngay_danh_gia", insertable = false, updatable = false)
    private Instant ngayDanhGia;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        DanhGiaSach that = (DanhGiaSach) o;
        return getIdDanhGia() != null && Objects.equals(getIdDanhGia(), that.getIdDanhGia());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
