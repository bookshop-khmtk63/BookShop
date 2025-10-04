package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

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
@Table(name = "THE_LOAI")
public class TheLoai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_the_loai")
    private Integer id;

    @Column(name = "ten_the_loai", nullable = false, unique = true)
    private String tenTheLoai;

    @Column(name = "mo_ta")
    private String moTa;
    @ManyToMany(mappedBy = "danhSachTheLoai", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude // Tránh vòng lặp vô hạn
    @ToString.Exclude        // Tránh vòng lặp vô hạn
    private Set<Sach> danhSachSach = new HashSet<>() ;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        TheLoai theLoai = (TheLoai) o;
        return getId() != null && Objects.equals(getId(), theLoai.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
