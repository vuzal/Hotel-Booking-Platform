package com.vusal.azerbook.model.entity;

import com.vusal.azerbook.enums.ReservationStatus;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@SQLRestriction("is_active=true")
@Table(name = "reservations")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @NotFound(action = NotFoundAction.IGNORE)
    User user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    @NotFound(action = NotFoundAction.IGNORE)
    Room room;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    @NotFound(action = NotFoundAction.IGNORE)
    Hotel hotel;

    @Column(name = "check-in", nullable = false)
    LocalDate checkIn;

    @Column(name = "check_out", nullable = false)
    LocalDate checkOut;

    @Column(name = "total_price", nullable = false)
    BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ReservationStatus status;

    @Column(name = "guest_count", nullable = false)
    Integer guestCount;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    Boolean isActive = true;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

}
