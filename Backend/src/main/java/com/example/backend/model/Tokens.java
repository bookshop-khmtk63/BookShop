package com.example.backend.model;

import com.example.backend.common.TokenType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "TOKENS")
public class Tokens {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private KhachHang user;

    @Column(name = "token", nullable = false, length = 512)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TokenType type;

    @Column(name = "expiry_date", nullable = false)
    private Timestamp expiryDate;

    @Column(name = "used")
    private boolean used = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Timestamp createdAt;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Tokens tokens = (Tokens) o;
        return getId() != null && Objects.equals(getId(), tokens.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
