package com.example.backend.model;

import com.example.backend.common.PhuongThucThanhToan;
import com.example.backend.common.TrangThaiDonHang;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
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
@Table(name = "DON_HANG")
public class DonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_don_hang")
    private Integer idDonHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_khach_hang")
    @ToString.Exclude
    private KhachHang khachHang;

    @Column(name = "ngay_dat", nullable = false)
    private Instant ngayDat;

    @Column(name = "tong_tien", nullable = false, precision = 12, scale = 2)
    private BigDecimal tongTien;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private TrangThaiDonHang trangThai = TrangThaiDonHang.CHO_XU_LY;

    @Column(name = "dia_chi_giao_hang", nullable = false)
    private String diaChiGiaoHang;

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc_thanh_toan")
    private PhuongThucThanhToan phuongThucThanhToan;

    @Lob
    @Column(name = "ghi_chu")
    private String ghiChu;

    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<DonHangChiTiet> chiTietDonHang = new HashSet<>();

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        DonHang donHang = (DonHang) o;
        return getIdDonHang() != null && Objects.equals(getIdDonHang(), donHang.getIdDonHang());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
