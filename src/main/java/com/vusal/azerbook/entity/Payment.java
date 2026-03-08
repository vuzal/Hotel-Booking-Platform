package com.vusal.azerbook.entity;

import com.vusal.azerbook.enums.PaymentMethod;
import com.vusal.azerbook.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("is_active=true")
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    Reservation reservation;

    @Column(nullable = false)
    BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    PaymentStatus status;

    @Column(name = "is_active")
    Boolean isActive;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;
}
