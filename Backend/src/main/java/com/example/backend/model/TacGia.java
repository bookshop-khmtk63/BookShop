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
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "TAC_GIA")
public class TacGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tac_gia")
    private Integer id;
    @Column(name = "ten_tac_gia", nullable = false)
    private String tenTacGia;
    @Column(name = "tieu_su")
    private String tieuSu;
    @Column(name = "quoc_tich")
    private String quocTich;
    @OneToMany(mappedBy = "tacGia",cascade = CascadeType.ALL,orphanRemoval = false,fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<Sach> sach=new HashSet<>();

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        TacGia tacGia = (TacGia) o;
        return getId() != null && Objects.equals(getId(), tacGia.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
