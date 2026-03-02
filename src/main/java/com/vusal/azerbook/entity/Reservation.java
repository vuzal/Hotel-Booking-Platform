package com.vusal.azerbook.entity;

import com.vusal.azerbook.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SoftDelete;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@SoftDelete(columnName = "is_active")
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    Room room;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    Hotel hotel;

    @Column(name = "check-in", nullable = false)
    LocalDateTime checkIn;

    @Column(name = "check_out", nullable = false)
    LocalDateTime checkOut;

    @Column(name = "total_price", nullable = false)
    BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ReservationStatus status;

    @Column(name = "guest_count", nullable = false)
    Integer guestCount;

    @Column(name = "is_active",nullable = false)
    Boolean isActive=true;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

}
