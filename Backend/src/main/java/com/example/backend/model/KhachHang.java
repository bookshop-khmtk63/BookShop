package com.example.backend.model;

import com.example.backend.common.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.sql.Timestamp;
import java.time.Instant;
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
@Table(name = "KHACH_HANG")
public class KhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_khach_hang")
    private Integer idKhachHang;

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "mat_khau", nullable = false)
    private String matKhau;
    @Column(name = "dia_chi", nullable = false)
    private String diaChi = "Chưa cập nhật ";

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "ngay_dang_ky", insertable = false, updatable = false)
    private Instant ngayDangKy;

    @Column(name = "active")
    private boolean active = true;

    @Column(name = "locked")
    private boolean locked = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role = Role.USER;

    @OneToOne(mappedBy = "khachHang", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private GioHang gioHang;

    @OneToMany(mappedBy = "khachHang", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<DonHang> donHangs = new HashSet<>() ;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<Tokens> tokens =new HashSet<>() ;
    @OneToMany(mappedBy = "khachHang", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<DanhGiaSach> danhGias =new HashSet<>();

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        KhachHang khachHang = (KhachHang) o;
        return getIdKhachHang() != null && Objects.equals(getIdKhachHang(), khachHang.getIdKhachHang());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
